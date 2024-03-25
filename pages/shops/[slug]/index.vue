<script setup>
import { useCrud } from "@/composables/useCrud";
import { useProductStore } from "@/stores/productStore";

import { drivewayDistance } from "@/composables/utils";

const { apiVersion } = useRuntimeConfig().public;
const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();

//vendor
const vendorLoaded = ref(false);
const vendor = ref({});
//categories
const categoriesLoaded = ref(false);
const categories = ref({});
const vendorDistance = ref("");
const getVendor = () => {
  crud.get({ path: apiVersion + "/vendors/" + slug }).then(async (response) => {
    // drivewayDistance

    await drivewayDistance(response.res.latitude, response.res.longitude).then(
      (distance) => {
        // console.log(distance)
        vendorDistance.value = distance.res;
      }
    );

    vendorLoaded.value = true;
    vendor.value = response.res;
  });
};

const getCategories = () => {
  crud
    .get({ path: apiVersion + "/vendors/" + slug + "/products-by-category" })
    .then((response) => {
      categoriesLoaded.value = true;
      categories.value = response.res;
    });
};

onMounted(() => {
  getVendor();
  getCategories();
});
</script>

<template>
  <div class="pt-[70px] sm:pt-20 border-b border-b-light-border">
    <div v-if="vendorLoaded">
      <NuxtLink :to="'/shops/' + slug">
        <CommonProfileHeroSection
          :type="'shops'"
          :title="vendor.name"
          :imagePath="networkImage(vendor.cover_path)"
          :logo="networkImage(vendor.logo_path)"
          :vendorDistance="vendorDistance"
        />
      </NuxtLink>
    </div>

    <div v-else>
      <ContainerAnimationPulse :customClass="'h-[400px] w-full'" />
    </div>
    <!-- categories -->
    <ContainerHorizontal
      v-if="categoriesLoaded"
      :title="'Categories'"
      :link="''"
    >
      <CommonCardsSubCategoryCard
        v-if="categories.length > 0"
        v-for="category in categories"
        :key="category.id"
        :categoryData="category"
        :link="'/shops/' + slug + '/' + category.slug"
      />
    </ContainerHorizontal>

    <div v-else>
      <ContainerHorizontal v-for="x in 2" :key="x" :title="'Categories'">
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 9"
            :key="i"
            customClass="h-80 w-64"
          />
        </div>
      </ContainerHorizontal>
    </div>
    <div v-for="category in categories">
      <ContainerHorizontal
        :title="category.name"
        :link="''"
        linkTitle="''"
      >
        <ProductCategorizedProducts
          :vendor="slug"
          :category="category"
          :perPage="10"
        />
      </ContainerHorizontal>
    </div>
  </div>
</template>
