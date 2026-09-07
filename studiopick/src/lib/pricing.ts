import product from "../data/product.json";

export interface BuildSelections {
  layout: string;
  caseColor: string;
  switchType: string;
  keycapSet: string;
  addOns: string[];
}

interface PricedOption {
  id: string;
  priceDelta?: number;
  price?: number;
}

const options = product.options as Record<string, PricedOption[]>;

function findOption(group: string, id: string): PricedOption | undefined {
  return options[group]?.find((option) => option.id === id);
}

export function calculateTotalPrice(selections: BuildSelections): number {
  const optionGroups = [
    ["layout", selections.layout],
    ["caseColor", selections.caseColor],
    ["switchType", selections.switchType],
    ["keycapSet", selections.keycapSet],
  ] as const;

  const optionTotal = optionGroups.reduce(
    (total, [group, id]) => total + (findOption(group, id)?.priceDelta ?? 0),
    0,
  );
  const addOnTotal = selections.addOns.reduce(
    (total, id) => total + (findOption("addOns", id)?.price ?? 0),
    0,
  );

  return product.product.basePrice + optionTotal + addOnTotal;
}