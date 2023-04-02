<template>
  <article class="prose dark:prose-invert w-full max-w-none">
    <slot
      v-if="loading"
      name="spinner"
    />
    <div
      v-if="readabilityResult === null"
      class="border-l-4 border-orange-500 bg-orange-100 p-1 text-sm text-orange-700"
      role="alert"
    >
      Unfortunately, it looks like this content cannot be displayed in a readable format. This depends on the website and not all websites allow for it.
    </div>
    <iframe
      v-if="readabilityResult === null"
      :src="url"
      class="h-full w-full border-none"
    />
    <div
      v-else
      v-html="content"
    />
  </article>
</template>
<script setup>
import DOMPurify from 'dompurify';
import { parseHTML } from 'linkedom';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { computed, ref, watchEffect } from 'vue';
import PageRequest from '@/libs/pageRequest';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const readabilityResult = ref(null);
const loading = ref(true);

const getReadability = async (url) => {
  const page = await new PageRequest(url).getData();
  const { document } = parseHTML(page.text);
  if (!isProbablyReaderable(document)) {
    return null;
  }
  return new Readability(document).parse();
};

const content = computed({
  get: () => DOMPurify.sanitize(readabilityResult.value?.content),
});

watchEffect(async () => {
  try {
    readabilityResult.value = null;
    loading.value = true;
    readabilityResult.value = await getReadability(props.url);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
