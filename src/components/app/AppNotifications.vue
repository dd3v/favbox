<template>
  <div class="flex">
    <NotificationGroup group="error">
      <div
        class="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-6 px-4"
      >
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
              v-for="notification in notifications"
              :key="notification.id"
              class="mx-auto mt-4 flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-neutral-700"
            >
              <div class="flex w-12 items-center justify-center bg-red-500">
                <svg
                  class="h-6 w-6 fill-current text-white"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                  />
                </svg>
              </div>

              <div class="-mx-3 px-4 py-2">
                <div class="mx-3">
                  <span class="font-semibold text-red-500">{{
                    notification.title
                  }}</span>
                  <p class="text-sm text-gray-600 dark:text-white">
                    {{ notification.text }}
                  </p>
                </div>
              </div>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>

    <NotificationGroup group="default">
      <div
        class="pointer-events-none fixed inset-0 z-50 flex items-end justify-end p-6 px-4"
      >
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
              v-for="notification in notifications"
              :key="notification.id"
              class="mx-auto mt-4 flex w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-md dark:bg-neutral-700"
            >
              <div class="flex w-12 items-center justify-center bg-blue-500">
                <svg
                  class="h-6 w-6 fill-current text-white"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
                  />
                </svg>
              </div>

              <div class="-mx-3 px-4 py-2">
                <div class="mx-3">
                  <span class="font-semibold text-blue-500">{{
                    notification.title
                  }}</span>
                  <p class="text-sm text-gray-600 dark:text-white">
                    {{ notification.text }}
                  </p>
                </div>
              </div>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>
  </div>
</template>
