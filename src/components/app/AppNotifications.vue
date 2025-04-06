<template>
  <div class="flex">
    <!-- Error Notifications -->
    <NotificationGroup group="error">
      <div
        class="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-6"
      >
        <div class="w-full max-w-xs">
          <Notification
            v-slot="{ notifications }"
            enter="transform ease-out duration-300 transition"
            enter-from="translate-y-full opacity-0"
            enter-to="translate-y-0 opacity-100"
            leave="transition ease-in duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
            move="transition duration-500"
            move-delay="delay-300"
          >
            <div
              v-for="notification in notifications"
              :key="notification.id"
              role="alert"
              class="mx-auto mt-4 flex w-full max-w-xs items-center gap-3 overflow-hidden rounded-lg border border-neutral-400/30 bg-red-600/60 p-3 text-sm shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-red-800/80 dark:text-white"
            >
              <div class="flex items-center justify-center text-white">
                <svg
                  class="size-5"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path
                    d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z"
                  />
                </svg>
              </div>
              <div class="flex-1 text-xs text-white">
                {{ notification.text }}
              </div>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>

    <!-- Default Notifications -->
    <NotificationGroup group="default">
      <div
        class="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-6"
      >
        <div class="w-full max-w-xs">
          <Notification
            v-slot="{ notifications }"
            enter="transform ease-out duration-300 transition"
            enter-from="translate-y-full opacity-0"
            enter-to="translate-y-0 opacity-100"
            leave="transition ease-in duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
            move="transition duration-500"
            move-delay="delay-300"
          >
            <div
              v-for="notification in notifications"
              :key="notification.id"
              role="alert"
              class="mx-auto mt-4 flex w-full max-w-xs items-center gap-3 overflow-hidden rounded-lg border border-neutral-400/30 bg-green-700/60 p-3 text-sm shadow-lg backdrop-blur-md dark:border-white/10 dark:bg-green-800/80 dark:text-white"
            >
              <div class="flex items-center justify-center text-white">
                <svg
                  class="size-5"
                  viewBox="0 0 40 40"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                >
                  <path
                    d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM21.6667 28.3333H18.3334V25H21.6667V28.3333ZM21.6667 21.6666H18.3334V11.6666H21.6667V21.6666Z"
                  />
                </svg>
              </div>
              <div class="flex-1 text-xs text-white">
                {{ notification.text }}
              </div>
            </div>
          </Notification>
        </div>
      </div>
    </NotificationGroup>
  </div>
</template>
