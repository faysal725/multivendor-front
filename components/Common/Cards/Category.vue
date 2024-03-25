<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useProductStore } from "~~/stores/productStore";

const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
// const apiVersion = "/api/v1";

const path = apiVersion + "/shop-categories";

const productStore = useProductStore();
const { insertProducts, emptyApiData, getAllProducts } = productStore;
var categoryData = [];

const sidescroll = ref(true);

var loaded = ref(false);

onMounted(async () => {
  if (productStore.getAllProducts()[path]) {
    categoryData = productStore.getAllProducts()[path];
    loaded.value = true;
  } else {
    await crud.get({ path: path }).then((res) => {
      loaded.value = true;
      categoryData = res.res;
      productStore.insertProducts(path, categoryData);
    });
  }
});
const goto = (item) => {
  navigateTo("/" + item.slug);
};
</script>

<template>
  <div v-if="loaded" class="flex items-center gap-4">
    <div
      @click="goto(item)"
      v-for="item in categoryData"
      :key="item.name"
      class="shadow-lg rounded-md flex flex-col bg-lightGray items-center transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      <div class="w-24 h-20 sm:w-28 sm:h-24">
        <img
          class="w-full h-full"
          :src="networkImage(item.image_path)"
          alt="category img"
        />
        <!-- <CommonCachedImage custom-class="w-full h-full" :image="item.image_path" /> -->
      </div>
      <p class="text-primary-col text-xs sm:text-sm font-medium py-1">
        {{ item.name }}
      </p>
    </div>

    <!-- blood donation -->
    <NuxtLink
      to="/blood-donation/"
      class="shadow-lg rounded-md overflow-hidden flex flex-col bg-lightGray items-center transition-all duration-200 hover:scale-105 cursor-pointer"
    >
      <div class="w-24 h-20 sm:w-28 sm:h-24">
        <img
          src="~~/assets/icons/blood-donation.png"
          class="h-full w-full"
          alt=""
        />
      </div>
      <p class="text-xs sm:text-sm font-medium py-1">Blood Donation</p>
    </NuxtLink>
    <!-- blood donation end -->
  </div>

  <!-- Category loading -->
  <div v-else class="w-full">
    <ContainerHorizontal
      :allData="'Category'"
      :title="''"
      :shouldScroll="sidescroll"
      :link="''"
    >
      <div class="mt-4 flex gap-4 w-full">
        <ContainerAnimationPulse
          v-for="i in 3"
          :key="i"
          customClass="sm:h-32 w-24 h-20 sm:w-40"
        />
      </div>
    </ContainerHorizontal>
  </div>
  <!-- Category loading end-->
</template>
