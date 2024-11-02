<template>
  <div
    v-if="editor"
  >
    <div class="flex flex-wrap items-center gap-x-4  p-4 text-gray-700">
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        I
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        S
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('underline') }"
        class="p-1"
        @click="editor.chain().focus().toggleUnderline().run()"
      >
        U
      </button>

      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        H3
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 4 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
      >
        H4
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 5 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
      >
        H5
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('heading', { level: 6 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
      >
        H6
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        Bullet list
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        Ordered list
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        Code block
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquote
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        Horizontal rule
      </button>
      <button
        type="button"
        @click="editor.chain().focus().setHardBreak().run()"
      >
        Hard break
      </button>
      <button
        type="button"
        @click="editor.chain().focus().undo().run()"
      >
        Undo
      </button>
      <button
        type="button"
        @click="editor.chain().focus().redo().run()"
      >
        Redo
      </button>
    </div>
    <editor-content
      :editor="editor"
      class="max-h-52 overflow-y-auto overflow-x-hidden"
    />
  </div>
</template>
<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';

const props = defineProps({
  modelValue: String,
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
      class: 'prose text-xs m-5 focus:outline-none ',
    },
  },

});
</script>
