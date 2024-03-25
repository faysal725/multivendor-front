<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";
const { apiVersion, frontendUrl } = useRuntimeConfig().public;

const authStore = useAuthStore();
const route = useRoute();
const slug = route.params.slug;

const { data } = await useFetch("/api/product?slug=" + slug);

useSeoMeta({
  title: data.value.meta_title,
  ogTitle: data.value.meta_title,
  description: data.value.meta_description,
  ogDescription: data.value.meta_description,
  ogImage: networkImage(data.value.thumbnail_path),
});

const crud = useCrud();

let path = apiVersion + "/products/" + slug;

var productData = {};
const loaded = ref(false);
var images = [];

let productId;
const productsLoaded = ref(false);
const products = ref([]);

crud.get({ path: path }).then(async (res) => {
  loaded.value = true;

  productData = res.res;
  productId = res.res.id;

  images.push(networkImage(res.res.thumbnail_path));
  productData.images.map((dt) => {
    images.push(networkImage(dt.path));
  });
  similarProductLoad(res.res.shop_category_id);
  if (authStore.auth.authenticated) {
    await crud.store({
      body: {
        product: productId,
      },
      path: apiVersion + "/user/recent-visits",
    });
  }
});

const similarProductLoad = async (shopCategoryId) => {
  console.log(shopCategoryId);
  crud
    .get({
      path:
        apiVersion +
        "/products/random-labeled-products/[" +
        shopCategoryId +
        "]/6",
    })
    .then((response) => {
      console.log(response.res);
      products.value = response.res;
      productsLoaded.value = true;

      // //has data so move to the next page
      // if (response.res.data.length > 0) {
      //   console.log(response.res.data);
      //   products.value.push(...response.res.data);
      //   apiRequesting.value = false;
      //   page.value++;
      // } else {
      //   apiRequesting.value = true;
      //   message.value = "No More Producs Found";
      // }
    });
};

let tabs = ref([
  { id: 0, name: "Reviews", current: true },
  { id: 1, name: "Description", current: false },
]);

const tabChange = (dt) => {
  tabs.value.map((dt) => (dt.current = false));
  tabs.value[dt].current = true;
};
</script>

<template>
  <div class="pt-10">
    <div class="bg-white">
      <div class="pt-10 sm:pt-16 px-4 sm:px-8 lg:max-w-full">
        <div class="lg:grid grid-cols-2 lg:items-start pt-4 sm:pt-14 xl:pt-4">
          <!-- image gallary  -->

          <ProductGallary
            v-if="loaded"
            :images="images"
            class="col-span-1 xl:px-20"
          />
          <div v-else>
            <ContainerAnimationPulse
              customClass="h-80 sm:h-[500px] w-full mr-5"
            />
          </div>

          <!-- Product info -->
          <ProductDetails
            v-if="loaded"
            :data="productData"
            class="col-span-1"
          />
          <div v-else>
            <ContainerAnimationPulse
              customClass="h-80 sm:h-[500px] w-full mt-5 sm:mt-0 sm:ml-5"
            />
          </div>
        </div>

        <div class="py-5">
          <ContainerHorizontal v-if="productsLoaded" :title="'Suggested Products'" class="">
            <CommonCardsProductCard
              v-if="products.length > 0"
              v-for="product in products"
              :cardData="product"
            /> 
          </ContainerHorizontal>
        </div>

        <div class="my-4">
          <!-- tabs -->
          <CommonTabs v-if="loaded" />
          <div v-else>
            <ContainerHorizontal>
              <div class="mt-4 flex gap-4">
                <ContainerAnimationPulse
                  v-for="i in 4"
                  :key="i"
                  customClass="h-20 w-20"
                />
              </div>
            </ContainerHorizontal>
          </div>

          <!-- description  -->
          <div id="reviews" class="border-t border-t-secondary-col/10">
            <CommonTabs :data="tabs" @update-input="tabChange" />
            <!-- <ProductDescription :data="product.description" /> -->

            <!-- reviews  -->
            <ProductReviews v-if="tabs[0].current" :product="productData" />

            <div
              v-if="tabs[1].current"
              class="w-full border-t border-t-secondary-col/10 bg pt-16 pb-4 sm:pb-16 sm:px-10"
            >
              <CommonDescriptionStyler :text="productData.content" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
