<template>
  <img :src="favicon" alt="favicon" v-if="favicon" />
  <globe-alt-icon v-else />
</template>
<script setup>
import { computed } from 'vue';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  favicon: {
    required: true,
  },
});
const favicon = computed(() => ((props.favicon && (props.favicon.includes('http') || props.favicon.includes('data:image'))) ? props.favicon : false));
</script>
