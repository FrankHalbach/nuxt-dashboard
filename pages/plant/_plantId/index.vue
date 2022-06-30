<template>
  <v-container fluid>
    <h2>{{ plantId }} {{ $store.getters.getSelectedSnapshot }}</h2>
    <v-row>
      <v-col
        cols="12"
        xl="6"
        v-for="customer in distinctCustomers"
        :key="customer"
      >
        <v-card flat outlined class="mt-2">
          <v-card-title>
            <NuxtLink :to="`/plant/${plantId}/${customer}`">
              {{ customer }}
            </NuxtLink>
          </v-card-title>
          <v-card-text>
            <status-chart
              :labels="labels"
              :budget="budget(customer)"
              :current="current(customer)"
              :actual="actual(customer)"
              :edi="edi(customer)"
              :fcst="fcst(customer)"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import customers from "~/static/customers";

export default {
  data: () => ({
    customers,
  }),
  computed: {
    plantId() {
      return this.$route.params.plantId;
    },
    distinctCustomers() {
      return this.$store.getters.getCustomersByPlant(this.plantId);
    },
    projects() {
      return this.$store.getters.getSelectedProjects;
    },
    labels() {
      return this.$store.getters.getSelectedLabels;
    },
  },
  methods: {
    projectsByCustomer(customer) {
      return this.projects.filter(
        (p) => p.plant === this.plantId && p.customer === customer
      );
    },
    budget(customer) {
      const projects = this.projectsByCustomer(customer);
      return this.$consolidate(projects.map((p) => p.budget));
    },
    current(customer) {
      const projects = this.projectsByCustomer(customer);
      return this.$consolidate(projects.map((p) => p.current));
    },
    actual(customer) {
      const projects = this.projectsByCustomer(customer);
      return this.$consolidate(projects.map((p) => p.actual));
    },
    edi(customer) {
      const projects = this.projectsByCustomer(customer);
      return this.$consolidate(projects.map((p) => p.edi));
    },
    fcst(customer) {
      const projects = this.projectsByCustomer(customer);
      return this.$consolidate(projects.map((p) => p.fcst));
    },
  },
};
</script>

<style>
</style>