<script setup>
import { useCrud } from "@/composables/useCrud";
import { useProductStore } from "@/stores/productStore";
import { vInfiniteScroll } from "@vueuse/components";
const route = useRoute();
const slug = route.params.slug;
const category = route.params.category;
const { apiVersion } = useRuntimeConfig().public;
const crud = useCrud();
const productsLoaded = ref(false);
const products = ref([]);

const apiRequesting = ref(true);
const page = ref(1);
const message = ref("");

//vendor
const vendorLoaded = ref(false);
const vendor = ref({});
//categories
const categoriesLoaded = ref(false);
const categories = ref({});

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
//       getProducts();
//     }
//   }
// };

const getProducts = () => {
  // apiRequesting.value = true;
  crud
    .get({
      path:
        apiVersion +
        "/vendors/" +
        slug +
        "/products-by-category/" +
        category +
        "/" +
        20 +
        "?page=" +
        page.value,
    })
    .then((response) => {
      productsLoaded.value = true;
      //has data so move to the next page
      if (response.res.data.length > 0) {
        products.value.push(...response.res.data);
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

    getProducts();
  }
}

const getVendor = () => {
  crud.get({ path: apiVersion + "/vendors/" + slug }).then((response) => {
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
  getProducts();
});
</script>

<template>
  <main class="pt-32">
    <div v-if="vendorLoaded">
      <NuxtLink :to="'/shops/' + slug">
        <CommonProfileHeroSection
          :type="'shops'"
          :title="vendor.name"
          :imagePath="networkImage(vendor.cover_path)"
          :logo="networkImage(vendor.logo_path)"
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
        cla
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
    <!-- products paginations -->
    <div class="px-4 sm:px-8 pb-4">
      <div
        v-if="productsLoaded"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1 pb-8"
      >
        <!-- {{products}} -->
        <CommonCardsProductCard
          v-if="products.length > 0"
          v-for="product in products"
          :cardData="product"
        />
        <div
          v-else
          class="w-full flex items-center justify-center text-warningRed"
        >
          No Product Found
        </div>
      </div>
      <p>{{ message }}</p>
      <div v-infinite-scroll="[onLoadMore, { distance: 10 }]" ref="el"></div>
    </div>
  </main>
</template>
