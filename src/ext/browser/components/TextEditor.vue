<template>
  <div v-if="editor">
    <div class="flex flex-wrap items-center gap-1 p-1 text-xs text-black">
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black text-white': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <PhTextB class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <PhTextItalic class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <PhTextStrikethrough class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        <PhTextUnderline class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        <PhTextHFour class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        <PhTextHFive class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        <PhTextHSix class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <PhListBullets class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <PhListNumbers class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <PhCode class="size-4" />
      </button>
      <button
        type="button"
        class="p-1"
        :class="{ 'rounded bg-black p-1 text-white': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <PhQuotes class="size-4" />
      </button>
    </div>
    <editor-content
      :editor="editor"
      class=""
    />
  </div>
</template>
<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import PhTextB from '~icons/ph/text-b';
import PhTextItalic from '~icons/ph/text-italic';
import PhTextStrikethrough from '~icons/ph/text-strikethrough';
import PhTextUnderline from '~icons/ph/text-underline';
import PhTextHFour from '~icons/ph/text-h-four';
import PhTextHFive from '~icons/ph/text-h-five';
import PhTextHSix from '~icons/ph/text-h-six';
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

const editor = useEditor({
  content: props.modelValue,
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  extensions: [StarterKit, Underline, Highlight, Typography],
  editorProps: {
    attributes: {
      class: 'prose text-xs min-h-32 p-2 focus:outline-none ',
    },
  },

});
</script>
