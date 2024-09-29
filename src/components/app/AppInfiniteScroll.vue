<template>
  <div
    ref="scroll"
  >
    <slot />
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  limit: {
    type: Number,
    default: 15,
  },
});
const emit = defineEmits(['scroll:end']);
const scroll = ref(null);
const skip = ref(0);
let isLoading = false;

const onScroll = () => {
  if (isLoading) return;
  const el = scroll.value;
  if (Math.round(el.offsetHeight + el.scrollTop) >= el.scrollHeight * 0.75) {
    isLoading = true;
    skip.value += parseInt(props.limit, 10);
    emit('scroll:end', skip.value);
    setTimeout(() => {
      isLoading = false;
    }, 1000);
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
