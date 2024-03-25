<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAddressStore } from "~~/stores/userAddressStore";

// {{base_url}}/api/v1/products/search?query=Cotton

const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();
const { apiVersion, radius } = useRuntimeConfig().public;
const path = apiVersion + "/products/search?query=" + slug;
// ?filter[brand]=1&include=defaultVariation&sort=-id
const addressStore = useAddressStore();

let loading = ref(false);
let products = ref([]);
const searchString = ref("");

let filters = ref("");
const searchRadius = ref(0);
searchRadius.value = radius;
const radiusQuery = ref("");

searchString.value = slug;
const searchApi = ref("");

const dataLoad = async (query) => {
  console.log("data", searchApi.value);
  let lat = addressStore.getAddress().lat;
  let lng = addressStore.getAddress().lng;
  let string = "&lat=" + lat + "&lng=" + lng;
  products.value = [];
  if (searchString.value.length < 1) {
    products.value = [];
    loading.value = false;
  } else {
    await crud
      .get({
        path:
          searchApi.value + string + query + radiusQuery.value + filters.value,
      })
      .then((res) => {
        if (res.res.data.length > 0) {
          products.value = res.res.data;
          loading.value = true;
        }
      });
  }
};

function filter(dt) {
  searchString.value = dt;
}
const queryBuilder = ({ string }) => {
  dataLoad("&sort=" + string);
};
const radiusFilter = () => {
  radiusQuery.value = "&radius=" + searchRadius.value;
  dataLoad("");
};
watch(
  () => searchString.value,
  () => {
    searchApi.value =
      apiVersion + "/products/search?query=" + searchString.value;
    console.log(searchApi.value);
    dataLoad("");
  },
  { deep: true }
);
const reset = () => {
  searchApi.value = apiVersion + "/products/search?query=" + searchString.value;
  dataLoad("");
};
onMounted(() => {
  searchString.value = slug;
  searchApi.value = apiVersion + "/products/search?query=" + searchString.value;
  dataLoad("");
});
</script>

<template>
  <div class="pt-28 lg:pt-40 min-h-screen px-4 sm:px-8">
    <div class="flex items-center justify-center pb-5">
      <CommonSearchbar
        :btn="'Search'"
        :label="'Search'"
        @update-input="filter"
      />
    </div>

    <div class="flex items-start justify-between pt-5">
      <div class="flex items-center gap-2 w-full">
        <button
          @click="queryBuilder({ string: '-price' })"
          class="px-4 py-1 text-sm font-medium border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          low to high
        </button>
        <button
          @click="queryBuilder({ string: '+price' })"
          class="px-4 py-1 text-sm font-medium border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
        >
          high to low
        </button>
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

      <!-- <label
        for="default-range"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Default range</label
      >
      <input
        id="default-range"
        type="range"
        v-modal="searchRadius"
        :value="searchRadius"
        class="w-full h-2 bg-primary-col rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      {{ searchRadius }} -->

      <div class="w-full">
        <input
          type="range"
          id="rangeInput"
          v-model="searchRadius"
          min="1"
          :max="radius"
          step="1"
          class="w-full"
        />
        <div class="flex items-center gap-3">
          <div
            class="border border-primary-col px-5 py-2 rounded-md min-w-[186px]"
          >
            <p class="text-lg font-medium">
              Distance :
              <span class="font-semibold">{{ searchRadius }}</span> km
            </p>
          </div>
          <button
            @click="radiusFilter()"
            class="px-4 py-1 text-sm font-semibold border border-primary-col rounded-md text-white bg-primary-col hover:text-primary-col hover:bg-white transition-all duration-300"
          >
            Find Near
          </button>
        </div>
      </div>
    </div>

    <ContainerVertical
      v-if="loading"
      :cardData="products"
      :title="'You Searched For: ' + searchString"
    >
      <CommonCardsProductCard
        v-for="data in products"
        :key="data.id"
        :cardData="data"
        class="min-w-[167px] sm:min-w-[250px]"
      />
    </ContainerVertical>

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
          <span class="text-logo-col/50">product</span>
          <span>.</span>
        </p>
      </div>
    </div>
  </div>
</template>
