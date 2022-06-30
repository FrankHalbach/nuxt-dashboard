<template>
  <v-simple-table dense>
    <template v-slot:default>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th
            class="text-left"
            v-for="(r, i) in plants"
            :key="i"
            :colspan="r.plants.length"
          >
            {{ r.region }}
          </th>
        </tr>
        <tr>
          <th>Customer Group</th>
          <th>Customer</th>
          <th
            class="text-left"
            v-for="(r, i) in plants.map((c) => c.plants).flat()"
            :key="i"
          >
            {{ r }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="c in customers">
          <template v-for="(cust, ci) in c.customers">
            <tr v-if="ci === 0" :key="`${c}-${cust}`">
              <td :rowspan="c.customers.length">{{ c.group }}</td>
              <td>{{ cust }}</td>
              <td
                v-for="(plant, i) in plants.map((c) => c.plants).flat()"
                :key="`${plant}${i}`"
              >
                <NuxtLink
                  :to="`/plant/${plant}/${cust}`"
                  v-if="customerPlantComboExists(cust, plant)"
                >
                  <div class="canClick" :style="getStatus(cust, plant)">
                    <!-- {{ formatPercent(getPerformance(cust, plant)) }} -->
                  </div>
                </NuxtLink>
              </td>
            </tr>
            <tr v-if="ci > 0" :key="`${c}-${cust}`">
              <td>{{ cust }}</td>
              <td
                v-for="(plant, i) in plants.map((c) => c.plants).flat()"
                :key="`${plant}${i}`"
              >
                <NuxtLink
                  :to="`/plant/${plant}/${cust}`"
                  v-if="customerPlantComboExists(cust, plant)"
                >
                  <div class="canClick" :style="getStatus(cust, plant)">
                    <!-- {{ formatPercent(getPerformance(cust, plant)) }} -->
                  </div>
                </NuxtLink>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import plants from "~/static/plants";
import customers from "~/static/customers";

export default {
  data: () => ({
    plants,
    customers,
  }),
  computed: {
    projects() {
      return this.$store.getters.getSelectedProjects;
    },
    actualIndex() {
      return this.$store.getters.getSelectedActualIndex;
    },
  },
  methods: {
    formatPercent(percent) {
      const rounded = Math.round(percent * 100);
      return new Intl.NumberFormat().format(rounded) + "%";
    },
    mapColor(col) {
      if (col === "green") return "#A9D08E";
      if (col === "red") return "#FF6969";
      if (col === "orange") return "#F4B084";
    },
    filterProjectsByCustomerPlant(customer, plant) {
      return this.projects.filter(
        (p) => p.plant === plant && p.customer === customer
      );
    },
    getPerformance(customer, plant) {
      const projects = this.filterProjectsByCustomerPlant(customer, plant);
      const edi = this.$consolidate(projects.map((p) => p.edi));
      const fcst = this.$consolidate(projects.map((p) => p.fcst));
      const total = this.$consolidate([edi, fcst]);
      const current = this.$consolidate(projects.map((p) => p.current));

      //skip actual month
      total.splice(0, this.actualIndex);
      current.splice(0, this.actualIndex);

      const sumCurrent = current.reduce((acc, r) => (acc += r), 0);
      const sumTotal = total.reduce((acc, r) => (acc += r), 0);

      const variance = (sumCurrent - sumTotal) / sumCurrent;

      return variance;
    },
    getColor(customer, plant) {
      const per = this.getPerformance(customer, plant);
      if (1 - per > 0.8) return "green";
      if (1 - per > 0.5) return "orange";
      else return "red";
    },
    customerPlantComboExists(customer, plant) {
      return this.filterProjectsByCustomerPlant(customer, plant).length > 0;
    },
    getStatus(customer, plant) {
      return {
        backgroundColor: this.mapColor(this.getColor(customer, plant)),
      };
    },
  },
};
</script>

<style>
.canClick {
  height: 33px;
  width: 33px;
  margin: auto;
  margin: 2px;
}
/* .canHover:hover {
  cursor: pointer;
} */
</style>