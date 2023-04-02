<template>
  <span class="rounded-full bg-rose-400 p-0.5 px-3 text-xs text-white">
    {{ badge }}
  </span>
</template>
<script setup>
defineProps({
  badge: {
    type: String,
    required: true,
  },
});
</script>
