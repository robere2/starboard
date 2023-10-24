<script setup lang="ts">
import RefLink from "./RefLink.vue";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  name: string
}>()

</script>

<template>
  <RefLink
    :name="name"
    :pkg="'api'"
  />
</template>

<style scoped>

</style>
