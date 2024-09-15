<template>
  <TransitionRoot
    as="template"
    :show="open"
  >
    <Dialog
      class="relative z-10"
      @close="open = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-1 sm:pb-4">
                <div class="mt-3 text-center sm:mt-0 sm:text-left">
                  <input
                    type="text"
                    class="w-full border-0 focus:outline-none focus:ring-0"
                    placeholder="Search..."
                  >
                  <div class="w-full">
                    <TabGroup>
                      <TabList class="flex space-x-1 rounded-xl bg-gray-300/20 p-1">
                        <Tab
                          v-for="category in Object.keys(categories)"
                          :key="category"
                          v-slot="{ selected }"
                          as="template"
                        >
                          <button
                            :class="[
                              'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-500 focus:outline-none',
                              selected
                                ? 'bg-white shadow dark:bg-neutral-900 dark:text-white'
                                : 'w-full rounded-lg py-1 text-sm font-medium leading-5 text-gray-500 hover:bg-white/[0.12] hover:text-gray-700 focus:outline-none dark:text-white',
                            ]"
                          >
                            {{ category }}
                          </button>
                        </Tab>
                      </TabList>

                      <TabPanels class="mt-2">
                        <TabPanel
                          v-for="(posts, idx) in Object.values(categories)"
                          :key="idx"
                          :class="[
                            'h-52 w-full rounded-xl bg-white p-3',
                            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                          ]"
                        >
                          <ul>
                            <li
                              v-for="post in posts"
                              :key="post.id"
                              class="relative rounded-md p-3 hover:bg-gray-100"
                            >
                              <h3 class="text-sm font-medium leading-5">
                                {{ post.title }}
                              </h3>

                              <ul
                                class="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500"
                              >
                                <li>{{ post.date }}</li>
                                <li>&middot;</li>
                                <li>{{ post.commentCount }} comments</li>
                                <li>&middot;</li>
                                <li>{{ post.shareCount }} shares</li>
                              </ul>

                              <a
                                href="#"
                                :class="[
                                  'absolute inset-0 rounded-md',
                                  'ring-blue-400 focus:z-10 focus:outline-none focus:ring-2',
                                ]"
                              />
                            </li>
                          </ul>
                        </TabPanel>
                      </TabPanels>
                    </TabGroup>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  @click="open = false"
                >
                  Deactivate
                </button>
                <button
                  ref="cancelButtonRef"
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="open = false"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue';
import {
  Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot,
  TabGroup, TabList, Tab, TabPanels, TabPanel,
} from '@headlessui/vue';

const open = ref(false);

const categories = ref({
  All: [
    {
      id: 1,
      title: 'Does drinking coffee make you smarter?',
      date: '5h ago',
      commentCount: 5,
      shareCount: 2,
    },
    {
      id: 2,
      title: "So you've bought coffee... now what?",
      date: '2h ago',
      commentCount: 3,
      shareCount: 2,
    },
    {
      id: 2,
      title: "So you've bought coffee... now what?",
      date: '2h ago',
      commentCount: 3,
      shareCount: 2,
    },
  ],
  Categories: [
    {
      id: 1,
      title: 'Is tech making coffee better or worse?',
      date: 'Jan 7',
      commentCount: 29,
      shareCount: 16,
    },
    {
      id: 2,
      title: 'The most innovative things happening in coffee',
      date: 'Mar 19',
      commentCount: 24,
      shareCount: 12,
    },
  ],
  Domains: [
    {
      id: 1,
      title: 'Ask Me Anything: 10 answers to your questions about coffee',
      date: '2d ago',
      commentCount: 9,
      shareCount: 5,
    },
    {
      id: 2,
      title: "The worst advice we've ever heard about coffee",
      date: '4d ago',
      commentCount: 1,
      shareCount: 2,
    },
  ],
});

</script>
