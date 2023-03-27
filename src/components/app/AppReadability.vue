<template>
  <article class="prose dark:prose-invert w-full max-w-none">
    <slot
      v-if="loading"
      name="spinner"
    />
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
import PageRequest from '@/libs/pageRequest';
import { parseHTML } from 'linkedom';
import { Readability, isProbablyReaderable } from '@mozilla/readability';
import { computed, ref, watchEffect } from 'vue';

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
    loading.value = true;
    readabilityResult.value = await getReadability(props.url);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
