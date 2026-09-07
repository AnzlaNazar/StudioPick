import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateTotalPrice, BuildSelections } from "../lib/pricing";

export interface CartItem extends BuildSelections {
  id: string;
  unitPrice: number;
  quantity: number;
  personalizationText?: string;
}

interface ConfiguratorState extends BuildSelections {
  personalizationText: string;
  cart: CartItem[];
  isAdvisorOpen: boolean;

  // Actions
  setLayout: (layout: string) => void;
  setCaseColor: (color: string) => void;
  setSwitchType: (sw: string) => void;
  setKeycapSet: (keycap: string) => void;
  toggleAddOn: (addonId: string) => void;
  setPersonalizationText: (text: string) => void;
  applyBuild: (build: BuildSelections) => void;
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  setAdvisorOpen: (open: boolean) => void;
  computedPrice: () => number;
}

export const useConfiguratorStore = create<ConfiguratorState>()(
  persist(
    (set, get) => ({
      // Initial defaults
      layout: "60",
      caseColor: "charcoal",
      switchType: "linear",
      keycapSet: "standard",
      addOns: [],
      personalizationText: "",
      cart: [],
      isAdvisorOpen: false,

      setLayout: (layout) => set({ layout }),
      setCaseColor: (caseColor) => set({ caseColor }),
      setSwitchType: (switchType) => set({ switchType }),
      setKeycapSet: (keycapSet) => set({ keycapSet }),

      toggleAddOn: (addonId) =>
        set((state) => ({
          addOns: state.addOns.includes(addonId)
            ? state.addOns.filter((id) => id !== addonId)
            : [...state.addOns, addonId],
        })),

      setPersonalizationText: (personalizationText) => set({ personalizationText }),

      applyBuild: (build) =>
        set({
          layout: build.layout,
          caseColor: build.caseColor,
          switchType: build.switchType,
          keycapSet: build.keycapSet,
          addOns: [...build.addOns],
        }),

      addToCart: () => {
        const state = get();
        const price = state.computedPrice();
        const newItem: CartItem = {
          id: `${Date.now()}`,
          layout: state.layout,
          caseColor: state.caseColor,
          switchType: state.switchType,
          keycapSet: state.keycapSet,
          addOns: [...state.addOns],
          personalizationText: state.personalizationText,
          unitPrice: price,
          quantity: 1,
        };
        set((state) => ({ cart: [...state.cart, newItem] }));
      },

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      setAdvisorOpen: (isAdvisorOpen) => set({ isAdvisorOpen }),

      computedPrice: () => {
        const state = get();
        return calculateTotalPrice({
          layout: state.layout,
          caseColor: state.caseColor,
          switchType: state.switchType,
          keycapSet: state.keycapSet,
          addOns: state.addOns,
        });
      },
    }),
    {
      name: "studiopick-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);