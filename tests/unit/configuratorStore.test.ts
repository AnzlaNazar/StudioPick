import { beforeEach, describe, expect, it } from "vitest";
import { useConfiguratorStore } from "@/store/configuratorStore";

describe("useConfiguratorStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useConfiguratorStore.getState().reset();
  });

  it("updates each configurable selection and toggles add-ons", () => {
    const store = useConfiguratorStore.getState();

    store.setLayout("tkl");
    store.setSwitchType("tactile");
    store.setCaseColor("coral");
    store.setKeycapSet("sculpted");
    store.toggleAddOn("wristrest");

    expect(useConfiguratorStore.getState()).toMatchObject({
      layout: "tkl",
      switchType: "tactile",
      caseColor: "coral",
      keycapSet: "sculpted",
      addOns: ["wristrest"],
    });

    store.toggleAddOn("wristrest");
    expect(useConfiguratorStore.getState().addOns).toEqual([]);
  });

  it("recalculates the dynamic total price after store updates", () => {
    const store = useConfiguratorStore.getState();

    expect(store.computedPrice()).toBe(149);
    store.setLayout("tkl");
    store.setSwitchType("tactile");
    store.toggleAddOn("wristrest");

    expect(useConfiguratorStore.getState().computedPrice()).toBe(204);
  });

  it("reset restores the initial defaults", () => {
    const store = useConfiguratorStore.getState();
    store.setLayout("full");
    store.setCaseColor("coral");
    store.setSwitchType("clicky");
    store.setKeycapSet("sculpted");
    store.toggleAddOn("case");
    store.setPersonalizationText("Studio");
    store.setAdvisorOpen(true);

    store.reset();

    expect(useConfiguratorStore.getState()).toMatchObject({
      layout: "60",
      caseColor: "charcoal",
      switchType: "linear",
      keycapSet: "standard",
      addOns: [],
      personalizationText: "",
      cart: [],
      isAdvisorOpen: false,
    });
    expect(useConfiguratorStore.getState().computedPrice()).toBe(149);
  });
});