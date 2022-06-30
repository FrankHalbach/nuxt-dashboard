<template>
  <v-container>
    <v-row>
      <v-col cols="12" xl="6">
        <v-card flat outlined>
          <v-card-title> {{ plantId }} - {{ customerId }} </v-card-title>
          <v-card-text>
            <status-chart
              :labels="labels"
              :budget="budget"
              :current="current"
              :actual="actual"
              :edi="edi"
              :fcst="fcst"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        xl="6"
        v-for="proj in projectsFiltered"
        :key="proj.projectNumber"
      >
        <v-card flat outlined :id="`p${proj.projectNumber}`">
          <v-card-title>
            {{ proj.projectNumber }} - {{ proj.projectTitle }}
          </v-card-title>
          <v-card-text>
            <status-chart
              :labels="labels"
              :budget="proj.budget"
              :current="proj.current"
              :actual="proj.actual"
              :edi="proj.edi"
              :fcst="proj.fcst"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-navigation-drawer
      permanent
      clipped
      right
      app
      v-if="projectsFiltered.length > 4"
    >
      <v-card elevation="6" class="ma-2">
        <v-card-title>Projects</v-card-title>
        <v-list dense>
          <v-list-item
            v-for="proj in projectsFiltered"
            :key="proj.projectNumber"
          >
            <v-list-item-content>
              <v-list-item-title>
                <NuxtLink
                  :to="{
                    path: `/plant/${plantId}/${customerId}`,
                    hash: `p${proj.projectNumber}`,
                  }"
                >
                  {{ proj.projectNumber }} -
                  {{ proj.projectTitle.slice(0, 20) }}
                </NuxtLink>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
import plants from "~/static/plants";
import customers from "~/static/customers";

export default {
  data: () => ({
    customers,
    plants,
  }),
  computed: {
    labels() {
      return this.$store.getters.getSelectedLabels;
    },
    customerId() {
      return this.$route.params.customerId;
    },
    plantId() {
      return this.$route.params.plantId;
    },
    projectsFiltered() {
      const projects = this.$store.getters.getSelectedProjects;
      return projects.filter(
        (i) => i.plant === this.plantId && i.customer === this.customerId
      );
    },
    budget() {
      return this.$consolidate(this.projectsFiltered.map((p) => p.budget));
    },
    current() {
      return this.$consolidate(this.projectsFiltered.map((p) => p.current));
    },
    actual() {
      return this.$consolidate(this.projectsFiltered.map((p) => p.actual));
    },
    edi() {
      return this.$consolidate(this.projectsFiltered.map((p) => p.edi));
    },
    fcst() {
      return this.$consolidate(this.projectsFiltered.map((p) => p.fcst));
    },
    customersFlat() {
      return this.customers.map((c) => c.customers).flat();
    },
    plantsFlat() {
      return this.plants.map((p) => p.plants).flat();
    },
  },
};
</script>

<style>
</style>