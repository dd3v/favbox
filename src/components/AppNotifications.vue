<template>
  <NotificationGroup group="default" position="bottom">
    <div class="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-6 px-4">
      <div class="w-full max-w-sm">
        <Notification
          v-slot="{ notifications }"
          enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-500"
          leave-from="opacity-100"
          leave-to="opacity-0"
          move="transition duration-500"
          move-delay="delay-300"
        >
          <div
            class="mx-auto mt-4 flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-neutral-700"
            v-for="notification in notifications"
            :key="notification.id"
          >
            <div class="flex w-12 items-center justify-center bg-green-400">
              <svg
                class="h-6 w-6 fill-current text-white"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z"
                />
              </svg>
            </div>

            <div class="-mx-3 px-4 py-2">
              <div class="mx-3">
                <span class="font-semibold text-green-400">{{ notification.title }}</span>
                <p class="text-sm text-gray-600 dark:text-white">{{ notification.text }}</p>
              </div>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>
</template>
