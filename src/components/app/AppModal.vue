<template>
  <transition name="slide">
    <div
      v-show="show"
      class="fixed inset-0 z-999999  flex h-full w-full flex-col items-center justify-center bg-gray-900 transition-opacity duration-300 ease-out"
      @click.self="close"
      @keydown.esc="close"
    >
      <slot name="body" />
    </div>
  </transition>
</template>
<script setup>
import { ref } from 'vue';

const show = ref(true);

const onEsc = (event) => {
  if (show.value === true && event.keyCode === 27) {
    show.value = false;
  }
};

const close = () => {
  show.value = false;
  document.removeEventListener('keyup', onEsc);
};

const open = () => {
  show.value = true;
  document.addEventListener('keyup', onEsc);
};

defineExpose({
  open,
  close,
});
</script>
<style scoped>
.slide-enter-from {
    opacity: 0;
    transform: translateY(0px);
    transition: 0.5s all ease;
}

.slide-enter-to {
    opacity: 1;
    transform: translateY(0px);
    transition: 0.5s all ease;
}

.slide-leave-to {
    opacity: 0;
    transform: translateY(0px);
    transition: 0.5s all ease;
}
</style>
