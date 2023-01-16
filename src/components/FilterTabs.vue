<!-- eslint-disable vuejs-accessibility/label-has-for -->
<!-- eslint-disable max-len -->
<template>
  <div class="flex">
    <div class="h-full sticky top-0">
      <div
        class="relative min-h-screen bg-gray-200 flex flex-col items-center align-middle justify-center w-12"
        role="tablist"
        aria-label="tabs"
      >
        <div
          class="absolute indicator h-10 w-10 my-auto bg-white rounded-md shadow"
          ref="indicatorRef"
        ></div>
        <button
          class="relative tab m-3 p-2 rounded-full"
          id="tab-1"
          tabindex="0"
          role="tab"
          aria-selected="true"
          aria-controls="panel-1"
          @click="handleTab"
          :ref="setTabRef"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 pointer-events-none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
            />
          </svg>
        </button>
        <button
          id="tab-2"
          class="relative tab m-3 p-2 rounded-full"
          tabindex="-1"
          role="tab"
          aria-selected="true"
          aria-controls="panel-2"
          @click="handleTab"
          :ref="setTabRef"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 pointer-events-none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
            />
          </svg>
        </button>
        <button
          id="tab-3"
          class="relative tab m-3 p-2 rounded-full"
          tabindex="-1"
          role="tab"
          aria-selected="true"
          aria-controls="panel-3"
          @click="handleTab"
          :ref="setTabRef"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6 pointer-events-none"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="h-full sticky top-0">
      <div id="panel-1" class="tab-content flex transition duration-300" :ref="setTabPanelRef">
        <div class="min-h-screen bg-white p-3">
          <div class="flex items-center bg-gray-200 rounded-md">
            <div class="pl-2">
              <svg
                class="fill-current text-gray-500 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  class="heroicon-ui"
                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                />
              </svg>
            </div>
            <input
              class="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
              id="search"
              type="text"
              placeholder="Search teams or members"
            />
          </div>
          <div class="py-3 text-sm">
            <div
              class="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2"
              v-for="(folder, key) in folders"
              :key="key"
            >
              <span class="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
              <div class="flex-grow  px-2">{{folder}}</div>
            </div>
          </div>
        </div>
      </div>
      <div id="panel-2" class="hidden opacity-0 transition duration-300" :ref="setTabPanelRef">
        <div class="min-h-screen bg-white p-3">
          <label for="search" class="form-label inline-block mb-2 text-gray-700">
            <input
              type="text"
              id="serch"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </label>
          <hr />
          <ul>
            <li>23234234</li>
            <li>dfdfsdf</li>
            <li>23423423</li>
            <li>sdfsdfsdf</li>
            <li>sdfsdfsdf</li>
            <li>234234234</li>
          </ul>
        </div>
      </div>
      <div id="panel-3" class="hidden opacity-0 transition duration-300" :ref="setTabPanelRef">
        <div class="min-h-screen bg-white p-3">
          <label for="search" class="form-label inline-block mb-2 text-gray-700">
            <input
              type="text"
              id="serch"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </label>
          <hr />
          <div class="overflow-auto h-screen text-justify">
            <ul class="overflow-auto">
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
              <li>1</li>
              <li>23</li>
              <li>3</li>
              <li>5</li>
              <li>4</li>
              <li>6</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full">
      <label
        for="default-search"
        class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >Search</label
      >
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            class="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search Mockups, Logos..."
          required
        />
        <div class="flex flex-row absolute right-2.5 bottom-2.5">
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
          <button
            type="submit"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import Bookmark from "@/storage/bookmark";
import initStorage from "@/storage/idb/idb";

await initStorage();
const bookmark = new Bookmark();
const folders = await bookmark.getDomains();
console.warn(folders);

const indicatorRef = ref(null);
const tabRefs = [];
const tabPanelRefs = [];
const setTabRef = (el) => tabRefs.push(el);
const setTabPanelRef = (el) => tabPanelRefs.push(el);

const handleTab = (tab) => {
  indicatorRef.value.style.top = `${
    tab.target.getBoundingClientRect().top - tab.target.parentElement.getBoundingClientRect().top
  }px`;
  const selectedTab = tab.target.getAttribute("aria-controls");
  console.warn(selectedTab);
  // eslint-disable-next-line no-restricted-syntax
  for (const tabPanel of tabPanelRefs) {
    console.warn(selectedTab);

    if (selectedTab === tabPanel.getAttribute("id")) {
      tabPanel.classList.remove("hidden", "opacity-0");
      tabPanel.classList.add("flex", "opacity-100");
    } else {
      tabPanel.classList.add("hidden", "opacity-0");
    }
  }
};

onMounted(() => {
  indicatorRef.value.style.width = `${tabRefs[0].getBoundingClientRect().width}px`;
  indicatorRef.value.style.top = `${
    tabRefs[0].getBoundingClientRect().top - tabRefs[0].parentElement.getBoundingClientRect().top
  }px`;
});
</script>
<style>
.indicator {
  transition: top 0.4s;
}
</style>
