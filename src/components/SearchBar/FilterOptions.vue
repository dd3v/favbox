<template>
  <Popover v-slot="{ open }" class="relative">
    <PopoverButton
      :class="open ? '' : 'text-opacity-90'"
      class="inline-flex items-stretch rounded-md border bg-white rounded-l-md px-2 py-2 hover:bg-gray-50 hover:text-gray-700"
    >
      <adjustments-horizontal-icon
        class="h-5 w-5 text-gray-600"
      />
    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="relative gap-1 bg-white p-7 flex flex-row">
            <div class="flex h-5 w-5 shrink-0 items-center justify-center">
              <div>
                <squares-2X2-icon class="mr-2 h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">codepen.io</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4">
            <button
              type="submit"
              class="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              <trash-icon class="h-4 w-4" />
              Delete all
            </button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue';
import { TrashIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';
</script>
