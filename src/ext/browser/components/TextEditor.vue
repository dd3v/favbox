<template>
  <div
    v-if="editor"
    class="flex size-full flex-col"
  >
    <div class="sticky top-0 z-10 flex flex-wrap items-center gap-1 bg-white p-2 text-xs text-black">
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black text-white': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <PhTextB class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <PhTextItalic class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <PhTextStrikethrough class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <PhTextUnderline class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <PhTextHOne class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <PhTextHTwo class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <PhTextHThree class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        <PhTextHFour class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <PhListBullets class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <PhListNumbers class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <PhCode class="size-5" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <PhQuotes class="size-5" />
      </button>
    </div>
    <editor-content
      :editor="editor"
      class="w-full flex-1 overflow-auto p-2"
    />
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import PhTextB from '~icons/ph/text-b';
import PhTextItalic from '~icons/ph/text-italic';
import PhTextStrikethrough from '~icons/ph/text-strikethrough';
import PhTextUnderline from '~icons/ph/text-underline';
import PhTextHFour from '~icons/ph/text-h-four';
import PhTextHOne from '~icons/ph/text-h-one';
import PhTextHTwo from '~icons/ph/text-h-two';
import PhTextHThree from '~icons/ph/text-h-three';
import PhQuotes from '~icons/ph/quotes';
import PhListNumbers from '~icons/ph/list-numbers';
import PhListBullets from '~icons/ph/list-bullets';
import PhCode from '~icons/ph/code';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelValue']);
const editor = ref(null);

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value) {
      const isSame = editor.value.getHTML() === value;
      if (isSame) return;

      editor.value.commands.setContent(value, false);
    }
  },
);
onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Underline, Highlight, Typography],
    editorProps: {
      attributes: {
        class: 'prose text-sm min-h-full w-full p-2 focus:outline-none ',
      },
    },
    content: props.modelValue,
    onUpdate: () => {
      emit('update:modelValue', editor.value.getHTML());
    },
  });
});
onBeforeUnmount(() => {
  editor.value.destroy();
});
</script>
