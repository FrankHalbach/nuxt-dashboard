<template>
  <v-container fluid>
    <h2>{{ customerId }} {{ $store.getters.getSelectedSnapshot }}</h2>
    <v-row>
      <v-col cols="12" xl="6" v-for="plant in distinctPlants" :key="plant">
        <v-card flat outlined class="mt-2">
          <v-card-title>
            <NuxtLink :to="`/customer/${customerId}/${plant}`">
              {{ plant }}
            </NuxtLink>
          </v-card-title>
          <v-card-text>
            <status-chart
              :labels="labels"
              :budget="budget(plant)"
              :current="current(plant)"
              :actual="actual(plant)"
              :edi="edi(plant)"
              :fcst="fcst(plant)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import plants from "~/static/plants";

export default {
  data: () => ({
    plants,
  }),
  computed: {
    plantId() {
      return this.$route.params.plantId;
    },
    customerId() {
      return this.$route.params.customerId;
    },
    distinctPlants() {
      return this.$store.getters.getPlantsByCustomer(this.customerId);
    },
    projects() {
      return this.$store.getters.getSelectedProjects;
    },
    labels() {
      return this.$store.getters.getSelectedLabels;
    },
  },
  methods: {
    projectsByPlant(plant) {
      return this.projects.filter(
        (p) => p.plant === plant && p.customer === this.customerId
      );
    },
    budget(plant) {
      const projects = this.projectsByPlant(plant);
      return this.$consolidate(projects.map((p) => p.budget));
    },
    current(plant) {
      const projects = this.projectsByPlant(plant);
      return this.$consolidate(projects.map((p) => p.current));
    },
    actual(plant) {
      const projects = this.projectsByPlant(plant);
      return this.$consolidate(projects.map((p) => p.actual));
    },
    edi(plant) {
      const projects = this.projectsByPlant(plant);
      return this.$consolidate(projects.map((p) => p.edi));
    },
    fcst(plant) {
      const projects = this.projectsByPlant(plant);
      return this.$consolidate(projects.map((p) => p.fcst));
    },
  },
};
</script>

<style>
</style>