import projects from "~/static/projects";
import Vue from "vue";

export const state = () => ({
  selectedSnapshot: "",
  selectedProjects: [],
  selectedLabels: [],
  selectedActualIndex: 0
});

export const getters = {
  getSnapshots(state) {
    return projects
      .map((p) => p.snapshot)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  },
  getSelectedSnapshot(state) {
    return state.selectedSnapshot;
  },
  getSelectedProjects(state) {
    return state.selectedProjects;
  },
  getSelectedLabels(state) {
    return state.selectedLabels;
  },
  getSelectedActualIndex(state) {
    return state.selectedActualIndex;
  },
  getCustomersByPlant: (state) => (plant) => {
    const customers = state.selectedProjects
      .filter((p) => p.plant === plant)
      .map((p) => p.customer);
    const distinctCustomer = [...new Set(customers)];
    return distinctCustomer;
  },
  getPlantsByCustomer: (state) => (customer) => {
    const plants = state.selectedProjects
      .filter((c) => c.customer === customer)
      .map((p) => p.plant);
    const distinctPlants = [...new Set(plants)];
    return distinctPlants;
  }
};

export const mutations = {
  setSnapshot(state, snapshot) {
    state.selectedSnapshot = snapshot;
    if (snapshot === "") state.selectedSnapshot = projects[0].snapshot;
    const snap = projects.find((p) => p.snapshot === snapshot);
    Vue.set(state, "selectedLabels", [...snap.labels]);
    Vue.set(state, "selectedProjects", [...snap.projects]);
    state.selectedActualIndex = snap.actualIndex;
  }
};
