import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  tool,
  UIMessage,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import productData from "@/data/product.json";

const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: "The advisor is not configured. Add GROQ_API_KEY to the deployment environment." },
        { status: 503 },
      );
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const systemPrompt = `You are the Style Advisor for The Forge, a custom mechanical keyboard configurator.
A visitor describes their situation — how they'll use the keyboard, budget, noise, or comfort preferences.
Ask a clarifying question if their message is too vague to recommend anything specific.
Once you have enough information, call the "configureProduct" tool to recommend a concrete build.

Rules:
- Only recommend options that exist in the product data below — never invent a color, switch type, or price that isn't listed.
- Never exceed the visitor's budget.
- Tone: knowledgeable, concise product specialist.

Product Data:
${JSON.stringify(productData, null, 2)}`;

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      messages: await convertToModelMessages(messages),
      system: systemPrompt,
      tools: {
        configureProduct: tool({
          description:
            "Generates a tailored keyboard configuration based on user constraints and budget.",
          inputSchema: z.object({
            usageContext: z.string().describe("Summary of user typing environment"),
            budget: z.number().describe("Target budget limit"),
            preferences: z.array(z.string()).describe("Prioritized attributes"),
          }),
          execute: async ({ budget, preferences }) => {
            if (budget < productData.product.basePrice) {
              return {
                insufficientBudget: true,
                minRequired: productData.product.basePrice,
                reasoning: [
                  {
                    choice: "Starting budget",
                    why: `The Forge starts at $${productData.product.basePrice} before optional upgrades. Increase your target budget to receive a complete build recommendation.`,
                  },
                ],
              };
            }

            const isQuiet = preferences.some((p) =>
              p.toLowerCase().includes("quiet") || p.toLowerCase().includes("office")
            );
            const selectedSwitch = isQuiet ? "linear" : "tactile";
            const selectedLayout = budget < 180 ? "60" : "tkl";
            const selectedCase = "charcoal";
            const selectedKeycaps = budget > 220 ? "sculpted" : "standard";

            const addOns: string[] = [];
            let currentCost =
              productData.product.basePrice +
              (productData.options.layout.find((l) => l.id === selectedLayout)?.priceDelta ?? 0) +
              (productData.options.caseColor.find((c) => c.id === selectedCase)?.priceDelta ?? 0) +
              (productData.options.switchType.find((s) => s.id === selectedSwitch)?.priceDelta ?? 0) +
              (productData.options.keycapSet.find((k) => k.id === selectedKeycaps)?.priceDelta ?? 0);

            if (budget - currentCost >= 25) {
              addOns.push("wristrest");
              currentCost += 25;
            }

            return {
              layout: selectedLayout,
              caseColor: selectedCase,
              switchType: selectedSwitch,
              keycapSet: selectedKeycaps,
              addOns,
              totalPrice: currentCost,
              reasoning: [
                {
                  choice: `Layout: ${selectedLayout.toUpperCase()}`,
                  why: "Optimized desk footprint based on your stated typing requirements.",
                },
                {
                  choice: `Switches: ${selectedSwitch}`,
                  why: isQuiet
                    ? "Smooth linear switches to maintain low acoustic profile."
                    : "Tactile bump feedback for enhanced typing response.",
                },
                {
                  choice: `Keycaps: ${selectedKeycaps}`,
                  why: "Durable construction suitable for prolonged daily usage.",
                },
                {
                  choice: "Accessories",
                  why: addOns.includes("wristrest")
                    ? "Ergonomic wrist rest included within budget margin."
                    : "Kept lean to remain strictly within your budget ceiling.",
                },
              ],
            };
          },
        }),
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        onError: (error) => {
          console.error("Advisor stream error:", error);
          return "The advisor could not complete the request. Please try again.";
        },
      }),
    });
  } catch (error) {
    console.error("Advisor request error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process advisor request", details: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}