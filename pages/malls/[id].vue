<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useProductStore } from "~~/stores/productStore";
import { ArrowPathIcon } from "@heroicons/vue/24/solid";

const project = "Multivendor Ecommerce";

const productStore = useProductStore();
const { insertProducts, emptyApiData, getAllProducts } = productStore;

const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;

const route = useRoute();
const slug = route.params.id;

let loading = ref(false);
let allData = ref();
let mallsId = ref();
var categoryData = ref([]);
const currentCategory = ref("all");

const mallsDataLoaded = ref(false);
const shopsLoaded = ref(false);
const categoryLoaded = ref(false);
const tabsData = [
  { id: 0, name: "All" },
  { id: 1, name: "Electronics" },
  { id: 2, name: "Clothing" },
  { id: 1, name: "Shoes" },
  { id: 2, name: "Jwellery" },
  { id: 2, name: "Others" },
];

let availableShops = ref([]);

async function shopsLoad() {
  let mallsApi = apiVersion + "/shopping-malls/" + slug;

  if (productStore.getAllProducts()[mallsApi]) {
    allData.value = productStore.getAllProducts()[mallsApi];
    mallsId.value = productStore.getAllProducts()[mallsApi].id;
    mallsDataLoaded.value = true;
  } else {
    await crud.get({ path: mallsApi }).then((res) => {
      allData.value = res.res;
      mallsId.value = allData.value.id;
      mallsDataLoaded.value = true;
      productStore.insertProducts(mallsApi, toRaw(allData.value));
    });
  }

  let vendorApi =
    apiVersion + "/vendors?filter[shopping_mall]=" + mallsId.value;
  if (productStore.getAllProducts()[vendorApi]) {
    availableShops.value = productStore.getAllProducts()[vendorApi];
    shopsLoaded.value = true;
  } else {
    await crud.get({ path: vendorApi }).then((res) => {
      if (Object.keys(res.res.data).length > 1) {
        availableShops.value = res.res.data;
        productStore.insertProducts(vendorApi, toRaw(availableShops.value));
      }
      shopsLoaded.value = true;
    });
  }
}

const categoryLoad = async () => {
  const categoryApi = apiVersion + "/shopping-malls/" + slug + "/categories";
  await crud.get({ path: categoryApi }).then((res) => {
    if (res.res.length > 0) {
      categoryLoaded.value = true;
      categoryData.value = res.res;
    }
  });
};
onMounted(async () => {
  shopsLoad();
  categoryLoad();
});

const filter = async (shopCategoryId) => {
  shopsLoaded.value = false;
  currentCategory.value = shopCategoryId;
  await crud
    .get({
      path:
        apiVersion +
        "/vendors?filter[shopping_mall]=" +
        mallsId.value +
        "&filter[shop_category]=" +
        shopCategoryId,
    })
    .then((res) => {
      if (res.res.data.length > 0) {
        shopsLoaded.value = true;
        availableShops.value = res.res.data;
      }
    });
};

const resetPage = async () => {
  shopsLoad();
  categoryLoad();
};
</script>

<template>
  <div class="pt-20">
    <div v-if="mallsDataLoaded">
      <CommonProfileHeroSection
        :title="allData.name"
        :imagePath="networkImage(allData.image_path)"
        :street_address="allData.street_address"
      />
      <div class="px-7 mt-6">
        <div class="flex items-center gap-2">
          <p class="font-medium text-2xl pb-2">Category</p>
          <button
            @click="resetPage"
            class="border rounded-lg p-1 transition-all duration-150 hover:bg-primary-col group"
          >
            <ArrowPathIcon
              class="h-5 w-5 transition-all duration-150 text-primary-col group-hover:text-white"
            />
          </button>
        </div>

        <ContainerHorizontal
          v-if="shopsLoad && categoryData.length > 0"
          :allData="categoryData"
          :title="''"
          :link="''"
          :shouldScroll="true"
        >
          <CommonCardsSubCategoryCard
            v-for="data in categoryData"
            @click="filter(data.id)"
            :key="data.id"
            link=""
            :categoryData="data"
          />
        </ContainerHorizontal>
        <p v-else class="text-warningRed text-sm">No Categories to show</p>
      </div>
      <div class="px-7 mt-6 flex sm:items-center gap-3 flex-col sm:flex-row">
        <p class="font-medium text-2xl">Shops</p>
      </div>
    </div>
    <!-- malls loading  -->
    <div v-else>
      <ContainerAnimationPulse :customClass="'h-[300px] w-full mb-10'" />
    </div>
    <!-- malls loading  -->
    <div v-if="shopsLoaded">
      <div class="px-7 mb-8 pt-4">
        <!-- nearest shops -->
        <div
          v-if="availableShops.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 2xl:grid-cols-10 gap-4"
          :allData="availableShops"
          :title="''"
        >
          <CommonCardsShop
            v-for="data in availableShops"
            :key="data.id"
            :shopData="data"
          />
        </div>
        <p class="font-medium text-sm pb-2 sdf text-warningRed" v-else>
          No Shops Available
        </p>
      </div>
    </div>
    <!-- shops loading  -->
    <div v-else class="px-7 mb-8 pt-4">
      <div class="mt-4 flex gap-4">
        <ContainerAnimationPulse
          v-for="i in 6"
          :key="i"
          customClass="h-28 w-80"
        />
      </div>
    </div>
    <!-- shops loading  -->
  </div>
</template>
