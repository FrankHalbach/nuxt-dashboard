<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" clipped app class="pt-4">
      <v-list dense>
        <v-list-item>
          <v-select
            dense
            :items="snapshots"
            v-model="selectedSnapshot"
            hide-details
            label="Selected Snapshot"
          />
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item>
          <v-radio-group
            v-model="view"
            row
            hide-details
            dense
            class="py-1 my-1"
          >
            <v-radio
              v-for="option in viewOptions"
              :key="option"
              :label="option"
              :value="option"
            ></v-radio>
          </v-radio-group>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item link to="/"> Overview </v-list-item>

        <template v-if="view === 'Plant'">
          <v-list-group v-for="region in plants" :key="region.region" no-action>
            <template v-slot:activator>
              <v-list-item-title>{{ region.region }}</v-list-item-title>
            </template>
            <template v-for="plant in region.plants">
              <v-list-item
                :key="plant.plant"
                :to="`/plant/${plant}`"
                v-text="plant"
                class="pl-6"
              >
              </v-list-item>

              <v-list-item
                v-for="cust in customersByPlant(plant)"
                :key="`${plant}-${cust}`"
                :to="`/plant/${plant}/${cust}`"
                v-text="cust"
                class="pl-9"
              >
              </v-list-item>
            </template>
          </v-list-group>
        </template>

        <template dense v-if="view === 'Customer'">
          <v-list-group v-for="oem in customers" :key="oem.group" no-action>
            <template v-slot:activator>
              <v-list-item-title>{{ oem.group }}</v-list-item-title>
            </template>
            <template v-for="customer in oem.customers">
              <v-list-item
                :key="customer.customer"
                :to="`/customer/${customer}`"
                v-text="customer"
                class="pl-6"
              >
              </v-list-item>

              <v-list-item
                v-for="plant in plantsByCustomer(customer)"
                :key="`${plant}-${customer}`"
                :to="`/customer/${customer}/${plant}`"
                v-text="plant"
                class="pl-9"
              >
              </v-list-item>
            </template>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left clipped-right>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-btn icon @click="$router.push('/')">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-toolbar-title
        >EDI Forecast Tracker - {{ selectedSnapshot }}</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <v-btn small @click="toggleTheme" text>
        <v-icon>{{
          isDark ? "mdi-weather-sunny" : "mdi-weather-night"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>
<script >
import plants from "~/static/plants";
import customers from "~/static/customers";
export default {
  data: () => ({
    plants,
    customers,
    drawer: true,
    view: "Plant",
    viewOptions: ["Plant", "Customer"],
  }),
  computed: {
    snapshots() {
      return this.$store.getters.getSnapshots;
    },
    projects() {
      return this.$store.getters.getSelectedProjects;
    },
    selectedSnapshot: {
      get() {
        return this.$store.getters.getSelectedSnapshot;
      },
      set(value) {
        this.$store.commit("setSnapshot", value);
      },
    },
    isDark() {
      return this.$vuetify.theme.dark;
    },
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    customersByPlant(plant) {
      return this.$store.getters.getCustomersByPlant(plant);
    },
    plantsByCustomer(customer) {
      return this.$store.getters.getPlantsByCustomer(customer);
    },
  },
  created() {
    if (this.selectedSnapshot === "") this.selectedSnapshot = this.snapshots[0];
  },
};
</script>
  