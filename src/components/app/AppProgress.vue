<template>
  <div
    class="overflow-hidden rounded-md border border-gray-100 bg-gray-50 p-0.5 shadow-none"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="`Progress: ${progress}%`"
  >
    <div class="relative flex items-center justify-center">
      <div
        class="absolute inset-y-0 left-0 rounded-lg bg-black transition-all duration-300 ease-out"
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
