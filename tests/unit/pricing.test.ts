import product from "@/data/product.json";
import { BuildSelections, calculateTotalPrice } from "@/lib/pricing";
import { describe, expect, it } from "vitest";

const defaultSelections: BuildSelections = {
  layout: "60",
  caseColor: "charcoal",
  switchType: "linear",
  keycapSet: "standard",
  addOns: [],
};

describe("calculateTotalPrice", () => {
  it("returns the exact base price for the default configuration", () => {
    expect(calculateTotalPrice(defaultSelections)).toBe(product.product.basePrice);
    expect(calculateTotalPrice(defaultSelections)).toBe(149);
  });

  it("adds the TKL layout and tactile switch deltas", () => {
    const selections = { ...defaultSelections, layout: "tkl", switchType: "tactile" };

    expect(calculateTotalPrice(selections)).toBe(179);
  });

  it("adds the wrist rest accessory price", () => {
    const selections = { ...defaultSelections, addOns: ["wristrest"] };

    expect(calculateTotalPrice(selections)).toBe(174);
  });

  it("sums every option and accessory in an extreme custom build", () => {
    const selections: BuildSelections = {
      layout: "full",
      caseColor: "coral",
      switchType: "tactile",
      keycapSet: "sculpted",
      addOns: ["wristrest", "case", "cable"],
    };

    expect(calculateTotalPrice(selections)).toBe(314);
  });
});