<script setup>
import { useCrud } from "@/composables/useCrud";
import { useCoordinateStore } from "@/stores/coordinateStore";
import { useAddressStore } from "@/stores/userAddressStore";
import { useAuthStore } from "@/stores/authStore";
import { useProductStore } from "@/stores/productStore";
import { vInfiniteScroll } from "@vueuse/components";
//setup

//dependencies
const { apiVersion, isNearest } = useRuntimeConfig().public;
const route = useRoute();
const category = route.params.slug;
const authStore = useAuthStore();
const crud = useCrud();
const path = apiVersion + "/products";
const shouldLocationOn = ref(false);
const coordsStore = useCoordinateStore();
const { takeLatLngFormUser, getCoords } = coordsStore;
const addressStore = useAddressStore();
const { getAddress, setAddress, takeCurrentLatLng, getUserCoords } =
  addressStore;
const productStore = useProductStore();
const { insertProducts, emptyApiData, getAllProducts } = productStore;

//variables
const products = ref();
const loaded = ref(false);
const brandsLoaded = ref(false);
const categoryStatus = ref("");
const categoryData = ref({});
const sidescroll = ref(true);
const productData = ref([]);

let offers = ref([]);
let nearestShops = ref([]);
let nearestShopList = ref([]);
let randomStore = ref([]);
let recentVisit = [];
let recentVisitedProduct = ref([]);
let availableMall = ref([]);
let subCategories = ref([]);
let brands = ref([]);

let viewMoreApi = ref({
  url: "",
  categoryName: "",
});
let presentPage = ref(1);
let totalpage = ref(0);

let isShopFound = ref("");
let shopSlug = [];
let shops = ref([]);
let shouldShopLoad = ref(true);
//dependencies

//functions
if (addressStore.getAddress().lat && addressStore.getAddress().lng) {
  shouldLocationOn.value = true;
}

const getCategory = async () => {
  // get brands
  await crud
    .get({ path: apiVersion + "/shop-categories/" + category })
    .then(async (result) => {
      categoryStatus.value = result.res.status == 1 ? "founded" : "notFounded";
      categoryData.value = result.res;
      getBrands();
    });
  // get brands
};

const getBrands = async () => {
  let brandsApi =
    apiVersion + "/brands/" + categoryData.value.id + "/shop-category";
  if (productStore.getAllProducts()[brandsApi]) {
    brandsLoaded.value = true;
    brands.value = productStore.getAllProducts()[brandsApi];
  } else {
    await crud.get({ path: brandsApi }).then((res) => {
      console.log("i am here in brand", res);

      brandsLoaded.value = true;
      brands.value = res.res;
      productStore.insertProducts(brandsApi, toRaw(brands.value));
    });
  }
};

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
      "&perPage=10&page=" +
      presentPage.value;
  } else {
    nearestShopApi = "";
  }
  await crud.get({ path: nearestShopApi }).then((res) => {
    console.log(res.res);
    if (res.res.data.length > 0) {
      shops.value = [...shops.value, ...res.res.data];
      shouldShopLoad.value = true;
      presentPage.value = presentPage.value + 1;
    } else if (res.res.data.length == 0) {
      shouldShopLoad.value = false;
    }
  });
};

const getRecentVisitedProducts = async () => {
  if (authStore.auth.authenticated) {
    let recentVisitApi = apiVersion + "/user/recent-visits";

    if (productStore.getAllProducts()[recentVisitApi]) {
      recentVisitedProduct.value =
        productStore.getAllProducts()[recentVisitApi];
    } else {
      await crud.index({ path: recentVisitApi }).then((res) => {
        if (res.res.length > 0) {
          recentVisitedProduct.value = res.res;
          productStore.insertProducts(
            recentVisitApi,
            toRaw(recentVisitedProduct.value)
          );
        }
      });
    }
  }
};

const getSubCategory = async () => {
  let categoryApi = apiVersion + "/shop-categories/" + category;
  if (productStore.getAllProducts()[categoryApi]) {
    subCategories.value = productStore.getAllProducts()[categoryApi];
  } else {
    await crud.get({ path: categoryApi }).then((res) => {
      if (res.res.sub_categories.length > 0) {
        subCategories.value = res.res.sub_categories;
        // subCategories.value = res.res.sub_categories.map((dt)=>{

        //   return {id:dt.id, image: networkImage(dt.image_path) , name:dt.name, slug:dt.slug};
        //   })
        productStore.insertProducts(categoryApi, toRaw(subCategories.value));
      }
    });
  }
};

const getBanner = async () => {
  let bannerApi = apiVersion + "/banners?shop_category=" + category;
  if (productStore.getAllProducts()[bannerApi]) {
    offers.value = productStore.getAllProducts()[bannerApi];
    loaded.value = true;
  } else {
    await crud.get({ path: bannerApi }).then((res) => {
      offers.value = res.res.data;
      loaded.value = true;
      productStore.insertProducts(bannerApi, toRaw(offers.value));
    });
  }
};

const getMalls = async () => {
  let latitude = addressStore.getAddress().lat;
  let longitude = addressStore.getAddress().lng;

  let mallsApi;

  if (isNearest) {
    mallsApi =
      apiVersion +
      "/shopping-malls/nearest?latitude=" +
      latitude +
      "&longitude=" +
      longitude;
  } else {
    mallsApi = "";
  }

  if (productStore.getAllProducts()[mallsApi]) {
    availableMall.value = productStore.getAllProducts()[mallsApi];
  } else {
    await crud.get({ path: mallsApi }).then((res) => {
      availableMall.value = res.res.data;

      productStore.insertProducts(mallsApi, toRaw(availableMall.value));
    });
  }
};

const dataLoad = async () => {
  // get category
  getCategory();
  // getBrands()
  // get banner
  getBanner();

  // get subcategorie
  getSubCategory();

  // get recent visited product
  getRecentVisitedProducts();

  // get malls
  getMalls();

  // get nearest shops
  getNearestShops();
};

onMounted(() => {
  dataLoad();
});

// const moreShopsLoad = async () => {
//   if (presentPage.value > totalpage.value) {
//     return;
//   }
//   presentPage.value = presentPage.value + 1;

//   getNearestShops();
// };

// if (process.client) {
//   window.addEventListener("scroll", () => {
//     onScroll();
//   });
// }

// function onScroll() {
//   if (shouldShopLoad.value == false) {
//     return;
//   }
//   // Get the scroll position of the document.
//   const scrollY = window.scrollY;

//   // Get the height of the document.
//   const scrollHeight = document.documentElement.scrollHeight;

//   // Check if the user has scrolled to the bottom of the page.
//   if (scrollY + document.documentElement.clientHeight >= scrollHeight) {
//     // Do something when the user has scrolled to the bottom of the page.

//     shouldShopLoad.value = false;
//     moreShopsLoad();
//   }
// }

const el = ref(null);

function onLoadMore() {
  if (shouldShopLoad.value) {
    shouldShopLoad.value = false;
    // moreShopsLoad();
    getNearestShops();
  }
}

const scrollRight = (e) => {
  sidescroll.value = true;
};

watch(
  () => addressStore.getAddress().address,
  () => {
    dataLoad();
  },
  { deep: true }
);

watch(
  () => addressStore.getAddress().lat && addressStore.getAddress().lng,
  () => {
    if (addressStore.getAddress().lat && addressStore.getAddress().lng) {
      shouldLocationOn.value = true;
    } else {
      shouldLocationOn.value = false;
    }
  },
  { deep: true }
);
</script>

<template>
  <Head>
    <Title>{{ category }}</Title>
    <Meta name="description" content="This is shopelo" />
    <Meta property="og:title" content="OG title" />
  </Head>

  <div
    v-if="
      (isShopFound == 'notFounded' && isNearest) ||
      categoryStatus == 'notFounded'
    "
    class="fixed bg-overlay/70 w-full h-full z-40 flex justify-center items-center"
  >
    <p
      class="bg-primary-col px-2 p-1 rounded-xl text-white hover:text-black hover:bg-white"
    >
      we are not currently providing any service at your location.
    </p>
  </div>

  <!-- v-else  -->
  <div
    v-else
    class="pt-[75px] sm:pt-20 max-w-full mx-auto bg-white z-10 relative"
  >
    <div class="border-t border-t-light-border bg-mediumGray">
      <!-- banner  -->

      <div v-if="loaded" class="bg-white">
        <div :title="'banner'" :items="'gallary'">
          <CommonCardsOffer :offerData="offers" :title="''" />
        </div>
      </div>
      <!-- banner end -->
      <!-- banner loading -->
      <div v-else class="w-full">
        <ContainerHorizontal
          :allData="banner"
          :title="'banner'"
          :shouldScroll="sidescroll"
        >
          <div class="mt-4 flex gap-4 w-full">
            <ContainerAnimationPulse
              customClass="h-[250px] sm:h-[500px] w-full"
            />
          </div>
        </ContainerHorizontal>
      </div>
      <!-- banner loading end-->

      <!-- categories -->
      <div v-if="loaded" class="bg-white border-b border-b-light-border pb-4">
        <!-- categories -->
        <ContainerHorizontal
          v-if="loaded"
          :allData="subCategories"
          :title="'Categories'"
          :link="''"
          :shouldScroll="sidescroll"
        >
          <CommonCardsSubCategoryCard
            v-for="data in subCategories"
            :key="data.id"
            :link="'/' + data.slug"
            :categoryData="data"
          />
        </ContainerHorizontal>
      </div>
      <!-- categories end-->
      <!-- categories loading -->
      <div v-else>
        <ContainerHorizontal
          :allData="categories"
          :title="'categories'"
          :shouldScroll="sidescroll"
        >
          <div class="mt-4 flex gap-4">
            <ContainerAnimationPulse
              v-for="i in 9"
              :key="i"
              customClass="h-20 w-32 sm:h-40 sm:w-60"
            />
          </div>
        </ContainerHorizontal>
      </div>
      <!-- categories loading end-->
    </div>

    <!-- Brands -->
    <div
      v-if="brandsLoaded"
      class="bg-white border-b border-b-light-border pb-4"
    >
      <ContainerHorizontal
        v-if="brands.length > 0"
        :allData="brands"
        :title="'Brands'"
        :link="''"
        :shouldScroll="sidescroll"
      >
        <li v-for="data in brands" :key="data.id" class="mt-4">
          <div
            class="w-20 sm:w-[120px] shadow-lg border border-light-border rounded-md overflow-hidden flex bg-white flex-col sm:gap-3 items-center cursor-pointer hover:shadow-xl transition-all duration-200"
          >
            <div class="w-full h-20 overflow-hidden">
              <img
                class="h-full w-full transition-all duration-300 scale-100 hover:scale-105"
                :src="networkImage(data.logo_path)"
                alt=""
              />
            </div>
            <p
              class="text-primary-col text-xs font-medium px-1 sm:mb-3 py-1.5 sm:py-0"
            >
              {{ data.name }}
            </p>
          </div>
        </li>
      </ContainerHorizontal>
    </div>
    <!-- Brands end-->
    <!-- Brands loading -->
    <div v-else>
      <ContainerHorizontal
        :allData="brands"
        :title="'Brands'"
        :shouldScroll="sidescroll"
      >
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 11"
            :key="i"
            customClass="h-20 w-32 sm:h-32 sm:w-48"
          />
        </div>
      </ContainerHorizontal>
    </div>
    <!-- Brands loading end-->

    <!-- marketCard -->
    <div v-if="loaded" class="pb-5 bg-white relative">
      <p
        v-if="availableMall.length <= 0"
        class="text-center text-base py-5 italic text-warningRed"
      >
        No Malls to show
      </p>
      <ContainerHorizontal
        v-else
        :title="'Nearest Malls'"
        items="'gallary'"
        :link="''"
      >
        <CommonCardsMarket
          v-for="data in availableMall"
          :key="data.id"
          :marketData="data"
        />
      </ContainerHorizontal>
    </div>
    <!-- marketCard end -->
    <!-- marketCard loading -->
    <div v-else>
      <ContainerHorizontal
        :allData="availableMall"
        :title="''"
        :shouldScroll="sidescroll"
      >
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 7"
            :key="i"
            customClass="h-[190px] w-[300px]"
          />
        </div>
      </ContainerHorizontal>
    </div>
    <!-- marketCard loading end-->

    <!-- nearest shops -->
    <div
      v-if="shops.length > 0"
      class="pb-4 border-b border-b-light-border relative"
    >
      <ContainerHorizontal
        v-if="loaded"
        :title="'Nearest Shops'"
        :link="'/' + category + '/nearest-shops'"
        :link-title="'Visit This Shop Now'"
      >
        <CommonCardsShop
          v-for="data in shops"
          :key="data.id"
          :shopData="data"
        />
      </ContainerHorizontal>
    </div>
    <!-- nearest shops end -->
    <!-- nearestShops loading -->
    <div v-else>
      <ContainerHorizontal
        :allData="shops"
        :title="'nearestShops'"
        :shouldScroll="sidescroll"
      >
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 11"
            :key="i"
            customClass="h-24 w-24 sm:h-28 sm:w-48"
          />
        </div>
      </ContainerHorizontal>
    </div>
    <!-- nearestShops loading end-->

    <!-- Recent Visit -->
    <div v-if="recentVisitedProduct.length > 0" class="relative">
      <ContainerHorizontal
        v-if="loaded"
        :cardData="recentVisitedProduct"
        :title="'Recent Visit'"
        :link="''"
      >
        <CommonCardsProductCard
          v-for="data in recentVisitedProduct"
          :key="data.id"
          :cardData="data"
          class="min-w-[167px] sm:min-w-[265px]"
        />
      </ContainerHorizontal>
    </div>

    <!-- Random Store -->
    <div
      v-if="shops.length > 0"
      v-for="shop in shops"
      class="pb-4 border-b border-b-light-border relative"
    >
      <ContainerHorizontal
        v-if="loaded"
        :title="shop.name"
        :link="'/shops/' + shop.slug"
        linkTitle="Visit This Store Now"
      >
        <RandomProductGenrator :shop="shop.slug" />
      </ContainerHorizontal>
    </div>
    <!-- random store end -->
    <!-- randomStore loading -->
    <div v-else>
      <ContainerHorizontal
        :allData="randomStore"
        :title="'randomStore'"
        :shouldScroll="sidescroll"
      >
        <div class="mt-4 flex gap-4">
          <ContainerAnimationPulse
            v-for="i in 7"
            :key="i"
            customClass="h-[330px] w-[250px]"
          />
        </div>
      </ContainerHorizontal>
    </div>
    <!-- randomStore loading end-->

    <div v-infinite-scroll="[onLoadMore, { distance: 10 }]" ref="el"></div>
  </div>
</template>
