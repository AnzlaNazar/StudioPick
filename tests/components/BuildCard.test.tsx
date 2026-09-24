import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BuildCard } from "@/components/advisor/BuildCard";
import { useConfiguratorStore } from "@/store/configuratorStore";

vi.mock("@/store/configuratorStore", () => ({
  useConfiguratorStore: vi.fn(),
}));

const applyBuild = vi.fn();
const setAdvisorOpen = vi.fn();

const buildInvocation = {
  state: "result" as const,
  toolName: "recommendBuild",
  result: {
    layout: "tkl",
    caseColor: "charcoal",
    switchType: "tactile",
    keycapSet: "standard",
    addOns: [],
    totalPrice: 179,
    reasoning: [{ choice: "Layout", why: "More room for navigation keys." }],
  },
};

describe("BuildCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useConfiguratorStore).mockImplementation((selector) =>
      selector({ applyBuild, setAdvisorOpen } as never),
    );
  });

  it("renders the recommended layout, switch, and total price", () => {
    render(<BuildCard invocation={buildInvocation} />);

    expect(screen.getByText("TKL")).toBeInTheDocument();
    expect(screen.getByText("tactile")).toBeInTheDocument();
    expect(screen.getByText("$179")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply Build" })).toBeInTheDocument();
  });

  it("applies the recommended build when clicked", () => {
    render(<BuildCard invocation={buildInvocation} />);

    fireEvent.click(screen.getByRole("button", { name: "Apply Build" }));

    expect(applyBuild).toHaveBeenCalledWith({
      layout: "tkl",
      caseColor: "charcoal",
      switchType: "tactile",
      keycapSet: "standard",
      addOns: [],
    });
  });

  it("renders the low-budget warning when the build is unavailable", () => {
    render(
      <BuildCard
        invocation={{
          state: "result",
          toolName: "recommendBuild",
          result: {
            insufficientBudget: true,
            minRequired: 149,
            reasoning: [],
          },
        }}
      />,
    );

    expect(screen.getByText("Budget below minimum starting build ($149).")).toBeInTheDocument();
    expect(screen.getByText("Please increase target budget.")).toBeInTheDocument();
  });
});