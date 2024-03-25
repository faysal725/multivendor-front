<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useCoordinateStore } from "~~/stores/coordinateStore";
import { useAddressStore } from "~~/stores/userAddressStore";
import { useProductStore } from "~~/stores/productStore";
import { productStoreChecker } from "../composables/utils";
const { apiVersion, isNearest, appName, appDescription } =
  useRuntimeConfig().public;

const project = "Multivendor Ecommerce";

const containerData = [
  {
    name: "Add your shop",
    description: "Grow you business and reach your nearby customers",
    img: "../assets/images/containerImg/bike.png",
    redirects: "Store Login",
  },
  {
    name: "Add your shop",
    description: "Be a delivery boy to build your delivery career",
    img: "../assets/images/containerImg/bike.png",
    redirects: "Store Earning",
  },
  {
    name: "Add your shop",
    description:
      "Help people donating blood. We’re not only for business but also for helping people.",
    img: "../assets/images/containerImg/bike.png",
    redirects: "Become a Donor",
  },
];

const crud = useCrud();

const path = apiVersion + "/products";

const productStore = useProductStore();
const { insertProducts, emptyApiData, getAllProducts } = productStore;

const addressStore = useAddressStore();

const { getAddress, setAddress, takeCurrentLatLng, getUserCoords } =
  addressStore;

const sidescroll = ref(true);
let isProductFound = ref("");

let randomStore = ref([]);
const dataLoad = async () => {
  let latitude = addressStore.getAddress().lat;
  let longitude = addressStore.getAddress().lng;

  let randomApi;

  if (isNearest) {
    randomApi = `${apiVersion}/vendors/random?latitude=${latitude}&longitude=${longitude}`;
  } else {
    randomApi = "";
  }

  if (productStore.getAllProducts()[randomApi]) {
    randomStore.value = productStore.getAllProducts()[randomApi];
    isProductFound.value =
      productStore.getAllProducts()[randomApi].length > 0 ? true : false;
  } else {
    await crud.get({ path: randomApi }).then((res) => {
      if (res.res == null) return;
      isProductFound.value = res.res.length > 0 ? true : false;
      randomStore.value = res.res.map((dt) => {
        let allData = {
          id: dt.id,
          name: dt.name,
          dist: "2.33 km",
          slug: dt.slug,
          logo: dt.logo_path,
          products: [],
        };

        dt.products.map((prd) => {
          allData.products.push(prd);
        });
        return allData;
      });
      productStore.insertProducts(randomApi, toRaw(randomStore.value));
    });
  }
};

onMounted(() => {
  locationTurnOn();
  dataLoad();
});

let shouldLocationBtnShow = ref(false);
let locationInstruction = ref({
  firstLine: "",
  link: "",
  lastLine: "",
});

function locationTurnOn() {
  if (navigator.geolocation) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then((permissionStatus) => {
        if (permissionStatus.state === "granted") {
        } else if (permissionStatus.state === "denied") {
          shouldLocationBtnShow.value = true;
          getBrowserName();
        } else {
        }
      })
      .catch((error) => {
        console.error("Error checking geolocation permission:", error);
      });
  }
}

const getBrowserName = () => {
  let browserInfo = navigator.userAgent;
  let browser;
  if (browserInfo.includes("Opera") || browserInfo.includes("Opr")) {
    browser = "Opera";
  } else if (browserInfo.includes("Edg")) {
    browser = "Edge";
  } else if (browserInfo.includes("Chrome")) {
    browser = "Chrome";
    locationInstruction.value.firstLine =
      "please copy this link, go to another tab and paste this link ";
    locationInstruction.value.link =
      "chrome://settings/content/location?search=location";
    locationInstruction.value.lastLine =
      "Then turn the location on and reload this tab";
  } else if (browserInfo.includes("Safari")) {
    browser = "Safari";
  } else if (browserInfo.includes("Firefox")) {
    browser = "Firefox";
    locationInstruction.value.firstLine =
      "please copy this link, go to another tab and paste this link ";
    locationInstruction.value.link = "about:preferences#privacy";
    locationInstruction.value.lastLine =
      "This opens the Settings - Location Permissions dialog box. From here, you can see which websites have requested access to your location and choose to allow or block them. Then reload this page.";
  } else {
    browser = "unknown";
  }
  return browser;
};

watch(
  () => addressStore.getAddress().lat && addressStore.getAddress().lng,
  () => {
    dataLoad();
  },
  { deep: true }
);
</script>

<template>
  <keep-alive :include="['homepage']">
    <main class="bg-white 2xl:max-w-full mx-auto relative z-10">
      <PageHerosection :serviceProviding="isProductFound" />

      <div
        v-if="randomStore.length > 0"
        v-for="data in randomStore"
        class="pb-4 border-b border-b-light-border relative"
      >
        <ContainerHorizontal :title="data.name" :link="'/shops/' + data.slug" linkTitle="Visit This Store Now">
          <CommonCardsProductCard
            v-for="item in data.products"
            :key="item.id"
            :cardData="item"
            class="min-w-[168px] sm:min-w-[265px] content"
          />
        </ContainerHorizontal>
      </div>

      <div v-else>
        <ContainerHorizontal :title="'categories'" :shouldScroll="sidescroll">
          <div class="mt-4 flex gap-4">
            <ContainerAnimationPulse
              v-for="i in 9"
              :key="i"
              customClass="h-40 w-60"
            />
          </div>
        </ContainerHorizontal>
      </div>
      <!-- randomStore loading -->
      <div
        v-if="locationInstruction.firstLine !== ''"
        class="flex justify-center"
      >
        <div class="flex flex-col items-center gap-2 pt-2">
          <div
            v-if="locationInstruction.firstLine != ''"
            class="max-w-lg border p-2 rounded-md border-primary-col/50 text-sm italic bg-overlay/20"
          >
            <p>{{ locationInstruction.firstLine }}</p>
            <p class="my-2 font-medium text-warningRed">
              {{ locationInstruction.link }}
            </p>
            <p>{{ locationInstruction.lastLine }}</p>
          </div>
        </div>
      </div>
      <!-- randomStore loading end-->

      <div class="mb-5 mt-5 sm:mt-10">
        <ContainerInformationType1 :data="containerData" />
      </div>

      <div class="mt-5 sm:mt-16 pb-4 sm:pb-8 bg-gray">
        <ContainerInformationType2 />
      </div>

      <div class="py-4 sm:py-9 bg-gray">
        <ContainerType3 />
      </div>

      <div class="py-4 sm:py-9">
        <ContainerTypeStory />
      </div>
    </main>
  </keep-alive>
</template>
