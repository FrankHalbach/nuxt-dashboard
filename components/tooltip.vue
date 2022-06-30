<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="expand">
        <slot />
      </div>
    </template>
    <span v-if="value">{{ value }}</span>
    <span v-else> no comment </span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["value"],
};
</script>

<style>
.expand {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 10px;
}
</style>