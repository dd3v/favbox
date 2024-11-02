<template>
  <div>
    <section
      v-if="editor"
      class="flex flex-wrap items-center gap-x-2  py-2 text-gray-700"
    >
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('bold') }"
        class="p-1"
        @click="editor.chain().focus().toggleBold().run()"
      >
        B
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('italic') }"
        class="p-1"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        I
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
        :class="{ 'rounded bg-gray-200': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        Strike
      </button>
      <button
        type="button"
        :class="{
          'rounded bg-gray-200': editor.isActive('heading', { level: 1 }),
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        H1
      </button>
      <button
        type="button"
        :class="{
          'rounded bg-gray-200': editor.isActive('heading', { level: 2 }),
        }"
        class="p-1"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        H2
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('bulletList') }"
        class="p-1"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        List
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('blockquote') }"
        class="p-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquot
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('bulletList') }"
        class="p-1"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        Bullet List
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('orderedList') }"
        class="p-1"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        Ordered List
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('blockquote') }"
        class="p-1"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        Blockquote
      </button>
      <button
        type="button"
        :class="{ 'rounded bg-gray-200': editor.isActive('code') }"
        class="p-1"
        @click="editor.chain().focus().toggleCode().run()"
      >
        Code
      </button>
      <button
        type="button"
        class="p-1"
        @click="editor.chain().focus().setHorizontalRule().run()"
      >
        Horizontal Rule
      </button>
      <button
        type="button"
        class="p-1 disabled:text-gray-400"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()"
      >
        Undo
      </button>
      <button
        type="button"
        :disabled="!editor.can().chain().focus().redo().run()"
        class="p-1 disabled:text-gray-400"
        @click="editor.chain().focus().redo().run()"
      >
        Redo
      </button>
    </section>
    <EditorContent :editor="editor" />
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
  extensions: [StarterKit, Underline,
    Highlight,
    Typography],
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert text-xs focus:outline-none min-h-12 h-full',
    },
  },
});
</script>
<style lang="css">
/* Basic editor styles */
.tiptap {
  :first-child {
    margin-top: 0;
  }

  /* List styles */
  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  /* Heading styles */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  /* Code and preformatted text styles */
  code {
    background-color: var(--purple-light);
    border-radius: 0.4rem;
    color: var(--black);
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: var(--black);
    border-radius: 0.5rem;
    color: var(--white);
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 0.75rem 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }
  }

  mark {
    background-color: #FAF594;
    border-radius: 0.4rem;
    box-decoration-break: clone;
    padding: 0.1rem 0.3rem;
  }

  blockquote {
    border-left: 3px solid #0e0d0d;
    margin: 1.5rem 0;
    padding-left: 1rem;
  }

  hr {
    border: none;
    border-top: 1px solid #0e0d0d;
    margin: 2rem 0;
  }
}
</style>
