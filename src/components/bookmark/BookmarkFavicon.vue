<template>
  <img :src="favicon" alt="favicon" v-if="favicon"  @error="handleError"/>
  <globe-alt-icon v-else />
</template>
<script setup>
import { ref } from 'vue';
import { GlobeAltIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  favicon: {
    required: true,
  },
});
const favicon = ref(((props.favicon && (props.favicon.includes('http') || props.favicon.includes('data:image'))) ? props.favicon : false));
const handleError = () => {
  favicon.value = false;
};
</script>
