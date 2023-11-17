<template>
  <transition name="slide">
    <div
      v-show="show"
      class="modal-backdrop"
      @click.self="close"
      @keydown.esc="close"
    >
      <div class="modal">
        <header class="modal-header">
          <div class="modal-title">
            <slot name="header" />
          </div>
          <div class="modal-close">
            <button
              class="close-btn"
              @click="close"
            >
              &#x2715;
            </button>
          </div>
        </header>
        <section class="modal-body">
          <slot name="body" />
        </section>
      </div>
    </div>
  </transition>
</template>
<script setup>
import { ref } from 'vue';

const show = ref(false);

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
