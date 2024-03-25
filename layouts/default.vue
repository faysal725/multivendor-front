<script setup>
import { useProductStore } from "~~/stores/productStore";
import {
  ShoppingBagIcon,
  XMarkIcon,
  ArrowUpIcon,
} from "@heroicons/vue/24/solid";
import { useNotificationStore } from "~~/stores/notificationStore";

// import useDetectOutsideClick from '../composables/useInput';

import { useAddressStore } from "~~/stores/userAddressStore";

import { useWindowScroll } from "@vueuse/core";

const { x, y } = useWindowScroll();

const { defaultLat, defaultLng, defaultZoom, isNearest } =
  useRuntimeConfig().public;

const productStore = useProductStore();
const { insertProducts, emptyApiData, getAllProducts } = productStore;

const notificationStore = useNotificationStore();
const { getNotificationState, getNotificationData, showNotification } =
  notificationStore;

const addressStore = useAddressStore();

const {
  getAddress,
  setAddress,
  takeCurrentLatLng,
  getUserCoords,
  setMapModal,
} = addressStore;
const route = useRoute();

let modalOn = ref(false);

if (process.client) {
  if (!addressStore.getAddress().lat && isNearest) {
    modalOn.value = true;
    addressStore.setMapModal(true);
  }
}

watch(
  () => route.fullPath,
  () => {
    if (!addressStore.getAddress().lat && isNearest) {
      if (route.name != "/user-location/new") {
        modalOn.value = false;
      } else {
        modalOn.value = true;
      }
    }
  },
  { deep: true }
);

var mapData = ref({});

const body = ref({
  name: "",
  streetAddress: "",
  status: true,
  lat: true,
  lng: true,
});

watch(
  () => mapData.value,
  () => {
    let address = {
      id: null,
      add: mapData.value.address,
      houseNo: null,
      floorNo: null,
      lat: mapData.value.lat,
      lng: mapData.value.lng,
    };

    addressStore.setAddress(address);
  },
  { deep: true }
);

watch(
  () => addressStore.getAddress().address,
  () => {
    if (!addressStore.getAddress().address && isNearest) {
      modalOn.value = true;
    }
  },
  { deep: true }
);

watch(
  () => addressStore.getAddress().mapModal,
  () => {
    if (addressStore.getAddress().mapModal) {
      modalOn.value = true;
    } else {
      modalOn.value = false;
    }
  },
  { deep: true }
);

const closeMapModal = () => {
  // modalOn.value = false;
  addressStore.setMapModal(false);
};
</script>

<template>
  <div
    v-if="modalOn"
    class="fixed bg-overlay/80 w-full h-full z-40 flex justify-center items-center p-4 sm:p-10"
  >
    <div
      class="w-full sm:w-1/2 flex flex-col gap-2 bg-white pb-3 rounded-md relative"
    >
      <div class="h-[550px] p-2 sm:p-5 rounded-md overflow-hidden">
        <p
          class="text-primary-col text-base sm:text-2xl font-medium pb-2 text-center"
        >
          Choose Location for personalizing
        </p>
        <Map v-model="mapData" :searchable="true" />
      </div>

      <div class="px-6 flex justify-end gap-8">
        <!-- <button
          class="bg-primary-col/20 text-white px-4 hover:animate-pulse p-2 rounded-lg cursor-not-allowed"
        >
          Go Ahead
        </button> -->
        <button
          v-if="Object.keys(mapData).length == 0"
          class="bg-primary-col/20 text-white px-4 hover:animate-pulse p-2 rounded-lg cursor-not-allowed"
        >
          Go Ahead
        </button>
        <button
          v-else
          @click="closeMapModal"
          class="bg-primary-col text-white px-4 hover:animate-pulse p-2 rounded-lg cursor-pointer"
        >
          Go Ahead
        </button>
      </div>

      <div class="absolute -top-7 -right-7">
        <XMarkIcon
          v-if="addressStore.getAddress().lat"
          @click="addressStore.setMapModal(false)"
          class="text-darkGray h-7 border border-primary-coll bg-white cursor-pointer hover:shadow-lg hover:text-red hover:border-red rounded-md transition-all duration-200"
          >close</XMarkIcon
        >
      </div>
    </div>
  </div>

  <div id="top" class="">
    <div
      class="transition ease-in-out duration-300 left-1/2 -translate-x-1/2 fixed w-full z-20 max-w-full"
    >
      <PageNavbar />
    </div>

    <!-- notificaiton section  -->
    <section
      class="fixed z-50 top-20 right-0 transition-all duration-150"
      :class="
        notificationStore.getNotificationState()
          ? 'translate-x-0'
          : 'translate-x-full'
      "
    >
      <CommonNotification />
    </section>

    <!-- cart -->

    <section class="fixed z-30 top-2/4 hidden sm:block">
      <CommonCart v-show="route.fullPath !== '/address-confirmation'" />
    </section>

    <!-- mobile menu cart -->
    <div>
      <section class="sm:hidden">
        <CommonMobileCart />
      </section>
    </div>

    <section>
      <CommonSideModal />
    </section>

    <!-- back to top btn -->
    <a
      href="#top"
      class="w-12 h-12 rounded-full shadow-2xl shadow-primary-col border hover:border-transparent scale-90 hover:scale-100 blurBg text-primary-col fixed bottom-14 sm:bottom-5 right-3 z-20 flex items-center justify-center transition-all duration-200"
      v-if="y > 265"
    >
      <ArrowUpIcon class="w-5 h-5" />
    </a>
    <!-- back to top btn end-->

    <div class="min-h-screen">
      <slot />
    </div>

    <PageFooter />
  </div>
</template>

<style scoped>
.blurBg {
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(60px);
}
.blurBg:hover {
  background: #2865a6;
  color: white;
  transition: 0.25s;
}
</style>
