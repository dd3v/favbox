<template>
  <div class="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-0.5 shadow-none">
    <div class="relative flex items-center justify-center">
      <div
        class="absolute inset-y-0 left-0 rounded-lg bg-black"
        :style="{ width: progress + '%' }"
      />
      <div class="relative text-xs text-white mix-blend-difference">
        {{ progress }}%
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: {
    type: Number,
    default: 0,
    required: true,
  },
});
</script>
