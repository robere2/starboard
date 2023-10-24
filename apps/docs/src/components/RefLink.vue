<script setup lang="ts">

const props = defineProps<{
  pkg: 'api' | 'framework' | 'cli',
  name: string
}>()
</script>

<template>
  <a :href="`/${props.pkg}/reference/${props.name}`"><code>{{ name }}</code></a>
</template>

<style scoped>

</style>
