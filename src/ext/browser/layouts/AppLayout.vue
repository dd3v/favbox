<template>
  <div class="flex h-screen w-full">
    <a-side :items="menu" />
    <main class="flex size-full overflow-hidden">
      <suspense>
        <router-view v-slot="{ Component }">
          <transition
            :name="transitionName"
            @before-enter="debug"
            @before-leave="debug"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </suspense>
    </main>
    <app-notifications />
  </div>
</template>

<script setup>
import { onErrorCaptured, watch, ref } from 'vue';
import { notify } from 'notiwind';
import AppNotifications from '@/components/app/AppNotifications.vue';
import { useRoute } from 'vue-router';
import BookmarkIcon from '@/components/icons/BookmarkIcon.vue';
import FavoriteIcon from '@/components/icons/FavoriteIcon.vue';
import TrashIcon from '@/components/icons/TrashIcon.vue';
import ASide from '@/ext/browser/components/ASide.vue';

const route = useRoute();
const menu = [
  { name: 'BookmarksView', label: 'Bookmarks', icon: BookmarkIcon },
  { name: 'FavoritesView', label: 'Favorites', icon: FavoriteIcon },
  { name: 'TrashView', label: 'Trash', icon: TrashIcon },
];

const transitionName = ref('next');
const previousPage = ref(0);

onErrorCaptured((e) => {
  notify({ group: 'error', title: 'Error', text: e.message }, 8500);
});

watch(route, (to) => {
  if (previousPage.value === 0) {
    previousPage.value = to.meta.page;
    transitionName.value = '';
    return;
  }

  // Сравниваем meta.page между маршрутами
  transitionName.value = to.meta.page > previousPage.value ? 'next' : 'prev';

  previousPage.value = to.meta.page;
});
</script>
<style>
  .next-leave-to {
    animation: leaveToTop 300ms both cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 0;
  }
  .next-enter-to {
    animation: enterFromBottom 300ms both cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 1;
  }

  .prev-leave-to {
    animation: leaveToBottom 300ms both cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 1;
  }
  .prev-enter-to {
    animation: enterFromTop 300ms both cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 0;
  }

  @keyframes leaveToTop {
    from {
      transform: translateY(0);
      opacity: 0.8;
    }
    to {
      transform: translateY(-100%);
      filter: brightness(0.5);
      opacity: 1;
    }
  }

  @keyframes enterFromBottom {
    from {
      transform: translateY(100%);
      filter: brightness(0.5);
      opacity: 0.8;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes leaveToBottom {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @keyframes enterFromTop {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }

  main {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  main > * {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
</style>
