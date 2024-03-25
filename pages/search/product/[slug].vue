<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAddressStore } from "~~/stores/userAddressStore";
import { vInfiniteScroll } from "@vueuse/components";

const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();
const { apiVersion, radius } = useRuntimeConfig().public;

// ?filter[brand]=1&include=defaultVariation&sort=-id
const addressStore = useAddressStore();

let loading = ref(false);
let shops = ref([]);
const searchString = ref("");

let filters = ref("");
let sorts = ref("");
const searchRadius = ref(0);
searchRadius.value = radius;
const apiRequesting = ref(false);
const page = ref(1);

searchString.value = slug;
const searchApi = ref("");

const dataLoad = async (query) => {
  apiRequesting.value = true;
  if (searchString.value.length < 1) {
    loading.value = false;
  } else {
    await crud
      .get({
        path:
          searchApi.value + sorts.value + filters.value + "&page=" + page.value,
      })
      .then((res) => {
        if (res.res.data.length > 0) {
          console.log("here in then page value", page.value);
          if (page.value == 1) {
            console.log("here in then 1");
            shops.value = res.res.data;
          } else {
            console.log("here in then 2");
            console.log("here in then 2", res.res.data);
            shops.value.push(...res.res.data);
          }
          apiRequesting.value = false;
          loading.value = true;
        } else {
          console.log("here in no data", page.value);
          console.log("here in no data", shops.value);
          apiRequesting.value = true;
        }
      });
  }
};

function filter(dt) {
  searchString.value = dt;
}
const queryBuilder = ({ string }) => {
  page.value = 1;
  sorts.value = "&sort=" + string;
  dataLoad("");
};
watch(
  () => searchString.value,
  () => {
    searchApi.value =
      apiVersion + "/vendors?filter[name]=" + searchString.value;
    // console.log(searchApi.value);
    page.value = 1;
    shops.value = [];
    dataLoad("");
  },
  { deep: true }
);
const reset = () => {
  searchApi.value = apiVersion + "/vendors?filter[name]=" + searchString.value;
  page.value = 1;
  sorts.value = "";
  dataLoad("");
};
onMounted(() => {
  searchString.value = slug;
  searchApi.value = apiVersion + "/vendors?filter[name]=" + searchString.value;
  dataLoad("");
});
const el = ref(null);

function onLoadMore() {
  // console.log("here");
  if (Object.keys(shops.value).length > 0) {
    if (!apiRequesting.value) {
      page.value++;
      dataLoad("");
    }
  }
}
</script>

<template>
  <div class="pt-10 lg:pt-10 min-h-screen px-4 sm:px-8">
    <div class="flex items-center justify-center pb-5">
      <CommonSearchbar
        :btn="'Search'"
        :label="'Search'"
        @update-input="filter"
      />
    </div>

    <div class="flex items-start justify-between py-5">
      <div class="flex items-center gap-2 w-full">
        <button
          @click="queryBuilder({ string: '+name' })"
          class="px-4 py-1 text-sm font-medium border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          A to z
        </button>
        <button
          @click="queryBuilder({ string: '-name' })"
          class="px-4 py-1 text-sm font-medium border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          z to A
        </button>
        <button
          @click="queryBuilder({ string: '-name' })"
          class="px-4 py-1 text-sm font-medium border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          z to A
        </button>
        <button
          @click="reset()"
          class="px-4 py-1 text-sm font-semibold border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          Reset
        </button>
      </div>
    </div>
    <div v-if="loading">
      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 sm:gap-5"
      >
        <div v-for="shop in shops">
          <nuxt-link :to="'/shops/' + shop.slug">
            <div
              class="rounded-sm cursor-pointer flex flex-col items-center justify-center group dark:text-white"
            >
              <div
                class="w-16 sm:w-20 h-16 sm:h-20 rounded-full overflow-hidden shadow-md"
              >
                <img
                  :src="networkImage(shop.logo_path)"
                  class="w-full h-full group-hover:animate-pulse"
                  alt=""
                />
              </div>
              <div
                class="text-center py-1.5 text-xs sm:text-sm font-medium group-hover:text-primary-col transition duration-200"
              >
                {{ shop.name }}
              </div>
            </div>
          </nuxt-link>
        </div>
      </div>
      <div v-infinite-scroll="[onLoadMore, { distance: 10 }]" ref="el"></div>
    </div>
    <div class="text-xl grid grid-cols-2 p-0 lg:p-20 pt-5 w-full" v-else>
      <div class="col-span-1 flex justify-end">
        <img
          class="h-80"
          src="../../assets/images/notFound/search2.png"
          alt=""
        />
      </div>
      <div class="col-span-1 flex items-center">
        <p class="text-xl text-overlay/20 font-bold max-w-lg">
          Your search did not <br />
          matched with any
          <span class="text-logo-col/50">shops</span>
          <span>.</span>
        </p>
      </div>
    </div>
  </div>
</template>
