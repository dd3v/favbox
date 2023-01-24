<!-- eslint-disable vuejs-accessibility/label-has-for -->
<template>
  <div
    class="h-screen w-full flex-row overflow-y-auto border-l border-solid border-gray-200 bg-gray-100 text-sm text-gray-600 delay-150 duration-100 ease-out"
    ref="block"
  >
    <TabGroup :selectedIndex="selectedTab" @change="changeTab">
      <div class="flex w-full p-2">
        <div class="flex w-full justify-center">
          <TabList class="flex w-72 space-x-1 rounded-xl bg-gray-300/20 p-1">
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-700',
                  ' focus:outline-none ',
                  selected
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700',
                ]"
              >
                Preview page
              </button>
            </Tab>
            <Tab v-slot="{ selected }" as="template">
              <button
                :class="[
                  'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-700',
                  'focus:outline-none ',
                  selected
                    ? 'bg-white shadow'
                    : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700',
                ]"
              >
                Edit bookmark
              </button>
            </Tab>
          </TabList>
        </div>
        <button @click="close">
          <x-circle-icon class="h-5 w-5" />
        </button>
      </div>

      <TabPanels>
        <TabPanel>
          <button @click="load">Load</button>
          <article class="prose prose-slate">
            <div v-html="content?.content"></div>
          </article>
        </TabPanel>
        <TabPanel>
          <form action="" class="mt-6 mb-0 space-y-4 rounded-lg p-8 shadow-2xl">
            <div>
              <label for="email" class="text-sm font-medium">Email</label>

              <div class="relative mt-1">
                <input
                  type="email"
                  id="email"
                  class="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                  placeholder="Enter email"
                />

                <span class="absolute inset-y-0 right-4 inline-flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              folders
            </div>
<div>tags</div>
            <button
              type="submit"
              class="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
            >
              Sign in
            </button>

            <p class="text-center text-sm text-gray-500">
              No account?
              <a class="underline" href="">Sign up</a>
            </p>
          </form>
        </TabPanel>
      </TabPanels>
    </TabGroup>
    <hr />
  </div>
</template>
<script setup>
import Parser from '@postlight/parser';
import { ref } from 'vue';
import { XCircleIcon } from '@heroicons/vue/24/outline';
import {
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue';

const selectedTab = ref(1);

function changeTab(index) {
  selectedTab.value = index;
}
const block = ref(null);
const content = ref({});
const load = async () => {
  try {
    content.value = await Parser.parse('https://tailwindcss.com/docs/font-size');
    console.warn(content);
  } catch (e) {
    console.warn(e);
  }
};

const close = () => {
  block.value.style.width = '0';
};

const open = async () => {
  block.value.style.width = '900px';
  if (selectedTab.value === 0) {
    await load();
  }
};

defineExpose({ open });
</script>
