<script setup>
import { useCrud } from "@/composables/useCrud";
import { useCoordinateStore } from "@/stores/coordinateStore";
import { useAddressStore } from "@/stores/userAddressStore";
import { vInfiniteScroll } from "@vueuse/components";

//dependencies
const { apiVersion, isNearest } = useRuntimeConfig().public;
const route = useRoute();
const category = route.params.slug;
const crud = useCrud();
const coordsStore = useCoordinateStore();
const { takeLatLngFormUser, getCoords } = coordsStore;
const addressStore = useAddressStore();
const { getAddress, setAddress, takeCurrentLatLng, getUserCoords } =
  addressStore;

const shops = ref([]);
const loaded = ref(false);
const apiRequesting = ref(true);
const page = ref(1);
const message = ref("");

// if (process.client) {
//   window.addEventListener("scroll", () => {
//     onScroll();
//   });
// }

// const onScroll = () => {
//   // Get the scroll position of the document.
//   const scrollY = window.scrollY;

//   // Get the height of the document.
//   const scrollHeight = document.documentElement.scrollHeight;

//   // Check if the user has scrolled to the bottom of the page.
//   if (scrollY + document.documentElement.clientHeight >= scrollHeight) {
//     // Do something when the user has scrolled to the bottom of the page.
//     console.log("here apiRequesting", apiRequesting.value);
//     if (!apiRequesting.value) {
//       getNearestShops();
//     }
//   }
// };

const getNearestShops = async () => {
  let latitude = addressStore.getAddress().lat;
  let longitude = addressStore.getAddress().lng;
  let nearestShopApi;
  if (isNearest) {
    nearestShopApi =
      apiVersion +
      "/vendors/nearest?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&category=" +
      category +
      "&perPage=3&page=" +
      page.value;
  } else {
    nearestShopApi = "";
  }
  await crud.get({ path: nearestShopApi }).then((res) => {
    if (res.res.data.length > 0) {
      //   shops.value = res.res.data
      shops.value.push(...res.res.data);
      loaded.value = true;
      apiRequesting.value = true;
      page.value++;
    } else {
      apiRequesting.value = false;
      message.value = "No More Producs Found";
    }
  });
};

const el = ref(null);

function onLoadMore() {
  if (apiRequesting.value) {
    apiRequesting.value = false;

    getNearestShops();
  }
}

onMounted(() => {
  getNearestShops();
});
</script>

<template>
  <div class="px-10 min-h-[100vh]">
    <p class="text-4xl text-center pt-32 mb-5">Nearest Shops</p>
    <!-- nearest shops -->
    <div
      v-if="shops.length > 0"
      class="pb-20 border-b border-b-light-border relative"
    >
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-5"
        v-if="loaded"
        :title="''"
        :link="'/' + category + '/nearest-shops'"
      >
        <CommonCardsShop
          v-for="data in shops"
          :key="data.id"
          :shopData="data"
        />
      </div>
    </div>
    <!-- nearest shops end -->
    <!-- nearestShops loading -->
    <div v-else>
      <ContainerVertical
        :allData="shops"
        :title="'nearestShops'"
        :shouldScroll="sidescroll"
      >
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 11"
            :key="i"
            customClass="h-28 w-48"
          />
        </div>
      </ContainerVertical>
    </div>
    <!-- nearestShops loading end-->

    <div v-infinite-scroll="[onLoadMore, { distance: 10 }]" ref="el"></div>
  </div>
</template>
