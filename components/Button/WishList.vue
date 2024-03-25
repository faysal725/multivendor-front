<script setup>
import {
  StarIcon,
  ShoppingCartIcon,
  Bars3BottomLeftIcon,
  HeartIcon,
} from "@heroicons/vue/20/solid";
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";
import { useNotificationStore } from "~~/stores/notificationStore";

const props = defineProps({
  productId: Number,
});

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/wishlists";

const notificationStore = useNotificationStore();
const {
  showNotification,
  hideNotification,
  getNotificationState,
  getNotificationData,
  storeNotificationData,
} = notificationStore;

let wishList = ref(false);

const storeWishList = async () => {
  await crud
    .store({
      body: { product: props.productId },
      path: path,
    })
    .then((res) => {
      notificationStore.storeNotificationData(
        "Products has been added to wishlist",
        "msg"
      );
      notificationStore.showNotification();
    });
};

const removeWishList = async () => {
  await crud.destroy({ path: path + "/" + props.productId }).then((res) => {
    notificationStore.storeNotificationData(
      "Products is removed from wishlist",
      "msg"
    );
    notificationStore.showNotification();
  });
};

watch(
  () => wishList.value,
  () => {
    if (wishList.value) {
      storeWishList();
    } else {
      removeWishList();
    }
  }
);
</script>

<template>
  <div
    v-if="authStore.auth.authenticated"
    class="w-6 h-6 rounded-full flex items-center justify-center bg-steel relative"
  >
    <HeartIcon
      @click="wishList = !wishList"
      :class="wishList ? 'text-red' : 'text-primary-col/70'"
      class="h-5 w-5 relative z-10 transition-all duration-150 cursor-pointer hover:scale-x-125"
    />
  </div>
</template>
