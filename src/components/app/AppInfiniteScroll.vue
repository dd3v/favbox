<template>
  <div
    ref="scroll"
    class="h-full overflow-y-auto"
  >
    <slot />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  limit: {
    type: Number,
    default: 50,
  },
});
const emit = defineEmits(['scroll:end']);
const scroll = ref(null);
const skip = ref(0);
const onScroll = () => {
  const el = scroll.value;
  if (Math.round(el.offsetHeight + el.scrollTop) >= el.scrollHeight) {
    skip.value += parseInt(props.limit, 10);
    emit('scroll:end', skip.value);
  }
};
const scrollUp = () => {
  skip.value = 0;
  scroll.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
onMounted(() => scroll.value.addEventListener('scroll', onScroll));
defineExpose({ scroll, scrollUp });
</script>
