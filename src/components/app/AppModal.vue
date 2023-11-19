<!-- eslint-disable tailwindcss/no-custom-classname -->
<template>
  <transition name="slide">
    <div
      v-show="show"
      class="modal-backdrop"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="modal">
        <section class="modal-body">
          <slot name="body" />
        </section>
      </div>
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

</style>
