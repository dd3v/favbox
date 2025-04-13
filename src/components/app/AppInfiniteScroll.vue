<template>
  <div ref="scroll">
    <slot />
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref, useTemplateRef } from 'vue';

const props = defineProps({ limit: { type: Number, default: 50 } });
const emit = defineEmits(['scroll:end']);
const scrollRef = useTemplateRef('scroll');
const skip = ref(0);
let lastScrollTop = 0;

const scrollUp = () => {
  skip.value = 0;
  scrollRef.value.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const throttle = (func, limit) => {
  let inThrottle = false;
  return (...args) => {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

const onScroll = () => {
  const el = scrollRef.value;
  const currentScrollTop = el.scrollTop;
  const isScrollingDown = currentScrollTop > lastScrollTop;
  lastScrollTop = currentScrollTop;
  if (!isScrollingDown) return;
  if (Math.round(el.offsetHeight + currentScrollTop) >= el.scrollHeight * 0.75) {
    skip.value += parseInt(props.limit, 10);
    emit('scroll:end', skip.value);
  }
};

const throttledScroll = throttle(onScroll, 200);

onMounted(() => scrollRef.value.addEventListener('scroll', throttledScroll));
onBeforeUnmount(() => { scrollRef.value?.removeEventListener('scroll', throttledScroll); });

defineExpose({ scrollRef, scrollUp, skip: skip.value });
</script>
