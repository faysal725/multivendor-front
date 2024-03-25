<script setup>
import { GoogleMap, Marker } from "vue3-google-map";
import { $fetch, FetchError } from "ofetch";
import { PhoneIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "@/stores/authStore";
import { useCrud } from "~~/composables/useCrud";
import { useAddressStore } from "~~/stores/userAddressStore";
import { useDonationStore } from "~~/stores/donationStore";

const addressStore = useAddressStore();
const { getAddress, setAddress } = addressStore;

const donationStore = useDonationStore();
const { getPatientAddress, getPatientCoordinate } = donationStore;

definePageMeta({
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/signup",
};

// blood
var bloodCategoryOptions = ref([
  { key: "A+", value: "A+" },
  { key: "A-", value: "A-" },
  { key: "B+", value: "B+" },
  { key: "B-", value: "B-" },
  { key: "O+", value: "O+" },
  { key: "O-", value: "O-" },
  { key: "Ab+", value: "Ab+" },
  { key: "AB-", value: "AB-" },
]);

var costOptions = ref([
  { key: "true", value: "true" },
  { key: "false", value: "false" },
]);

// brandOptions.value.push({'key':data.id,'value':data.name});

const authStore = useAuthStore();
const crud = useCrud();

const route = useRoute();
const slug = route.params.slug;

let shouldSideFormShow = ref(false);
let donorList = ref("");
let donorLoad = ref(false);

let location = ref();
let loading = ref(false);
let loader = ref(false);
let streetAddress = ref("");
let setDropdown = ref(false);
let dropdownItem = [];

const { apiVersion, isNearest, defaultLat, defaultLng, defaultZoom } =
  useRuntimeConfig().public;
let path = apiVersion + "/user/delivery-addresses";
const placeApiPath = apiVersion + "/get-addresses-by-string";

let key = ref(1);
let searchKey = ref(1);
// let center = { lat: 23.754491313449115, lng: 90.38906184560385 };
// let center = ref({ lat: 0, lng: 0 });
let center = ref({ lat: Number(defaultLat), lng: Number(defaultLng) });
const toZoom = ref(Number(defaultZoom));

const markerOptions = ref({
  position: center.value,
  label: "D",
  title: "Donar",
  draggable: true,
  clickble: true,
});

const router = useRouter();

let mapAddress = ref("");
let responseUpdateKey = ref(1234);
let networkResponse = [];

if (process.client) {
  // get geolocation
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      let coords = {
        latitude: latitude,
        longitude: longitude,
      };
      location.value = coords;
      loading.value = true;
    },
    (error) => {
      location.value = error;
    }
  );
}

// if (route.params.slug == "new") {
//   shouldSideFormShow.value = false
// }else{
//   shouldSideFormShow.value = true
// }

const form = ref({
  blood_type: null,
  bags: 0,
  address: "",
  name: "",
  phone: "",
  notes: "",
  cost: "",
  lat: "",
  lng: "",
});

const errors = ref({
  name: "",
  address: "",
  houseNo: "",
  floorNo: "",
  contact_name: "",
  contact_number: "",
});

let oldValue = ref({
  blood_type: null,
  bags: 0,
  address: "",
  name: "",
  phone: "",
  notes: "",
  cost: "",
  lat: "",
  lng: "",
});
let oldKey = ref(1);

var isDefault = ref([]);
const statusOptions = [
  {
    key: true,
    value: "ON",
  },
  {
    key: false,
    value: "OFF",
  },
];

var mallsOptions = ref([]);
var shopCategoryOptions = ref([]);
var isShopCategoryLoaded = ref(false);
var isMallsLoaded = ref(false);
var searchString = ref("");

const submit = async (e) => {
  e.preventDefault();
  let donerReqApi = apiVersion + "/blood-donation/get-donars";
  loading = true;

  let donerInfo;
  donerInfo = {
    blood_type: form.value.blood_type,
    Bags: form.value.bags,
    address: form.value.address,
    name: form.value.name,
    phone: form.value.phone,
    notes: form.value.notes,
    cost: form.value.cost,
    lat: location.value.latitude,
    lng: location.value.longitude,
  };

  // console.log(donerInfo);

  await crud
    .store({
      body: donerInfo,
      path: donerReqApi,
    })
    .then((res) => {
      if (res.status == 200) {
        donorList.value = res;
        donorLoad.value = true;
        console.log(res);
      }
    });
};

const dataLoad = async () => {
  await crud
    .index({
      path: path + "/" + slug,
    })
    .then((res) => {
      oldValue.value.name = res.res.name;
      // oldValue.value.address = res.res.street_address
      oldValue.value.houseNo = res.res.house_no;
      oldValue.value.floorNo = res.res.floor_no;
      oldValue.value.contact_name = res.res.contact_name;
      oldValue.value.contact_number = res.res.contact_number;

      mapAddress.value = res.res.street_address;
      isDefault.value = res.res.is_default;

      form.value.name = res.res.name;
      form.value.address = res.res.street_address;
      form.value.houseNo = res.res.house_no;
      form.value.floorNo = res.res.floor_no;
      form.value.contact_name = res.res.contact_name;
      form.value.contact_number = res.res.contact_number;

      // mapAddress.value = res.res.street_address

      oldKey.value++;
      key.value++;
    });
};

onMounted(() => {
  if (/^\d+$/.test(slug)) {
    dataLoad();
    path = path + "/" + slug;
  }

  center.value.lat = Number(addressStore.getAddress().lat);
  center.value.lng = Number(addressStore.getAddress().lng);
  loading.value = true;
});

const getAddressByName = async () => {
  if (searchString.value.length > 2) {
    const response = await networkGet({
      heads: {
        accept: "application/json",
      },
      method: "GET",
      path: placeApiPath + "/" + searchString.value,
    }).then((res) => {
      dropdownItem = res.res;
      setDropdown.value = true;
      key.value++;

      setDropdown.value = true;
      // const changed = res.map(dt => {
      //   let data = {
      //     name: dt.name,
      //     value: dt.lat
      //   }
      // })
    });
  }
};

const getPlace = async (lat, lng) => {
  const response = await useFetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyAxPHXcoWF4H-g-8kivUn8FlF2uyvqHZqs`
  ).then((res) => {
    const { results } = res.data._rawValue;

    const placeName = [];
    const typeLists = ["plus_code", "postal_code"];

    results.map((res) => {
      if (res["plus_code"] || res["postal_code"]) {
        let geo = res["geometry"]["location_type"];
        if (
          geo == "RANGE_INTERPOLATED" ||
          geo == "GEOMETRIC_CENTER" ||
          geo == "ROOFTOP"
        ) {
          placeName.push(res["formatted_address"]);
        }
      }
    });
    return placeName;
  });
  return response;
};

async function setCoords(e) {
  shouldSideFormShow.value = true;
  e.preventDefault;

  let position = {
    lat: e.latLng.lat(),
    lng: e.latLng.lng(),
  };

  location.value = {
    latitude: e.latLng.lat(),
    longitude: e.latLng.lng(),
  };

  markerOptions.value.position = position;

  await getPlace(position.lat, position.lng).then((res) => {
    mapAddress.value = res[0];
    form.value.address = res[0];
  });

  center = { lat: position.lat, lng: position.lng };
  // for test purpose
  // getAddressByName("dhaka", position.lat, position.lng)

  markerOptions.value = {
    position: position,
    label: "U",
    title: "Your Location",
    draggable: true,
  };

  key.value++;
}

async function setLocationBySearch(dt) {
  shouldSideFormShow.value = true;
  // const {name, lat, lng} = dt
  const { name, address, place_id } = dt;

  await networkGet({
    heads: {
      accept: "application/json",
    },
    method: "GET",
    path: apiVersion + "/" + "get-lat-lng-by-place-id/" + place_id,
  }).then((res) => {
    let position = {
      lat: res.res.lat,
      lng: res.res.lng,
    };

    location.value = {
      latitude: res.res.lat,
      longitude: res.res.lng,
    };

    markerOptions.value.position = position;

    mapAddress.value = name;
    streetAddress.value = address;
    searchString.value = address;
    searchKey.value++;

    center.value = { lat: Number(res.res.lat), lng: Number(res.res.lng) };
    toZoom.value = 20;

    markerOptions.value = {
      position: position,
      label: "L",
      title: "LADY LIBERTY",
      draggable: false,
    };

    form.value.address = name;
    key.value++;
    setDropdown.value = false;
  });
}
</script>
<template>
  <section
    class="flex flex-col justify-around max-w-full mx-auto 2xl:px-8 gap-8 px-4 sm:px-10 pt-28 sm:pt-32 bg-[#e2e8f0] min-h-screen"
  >
    <p v-if="!donorLoad" class="text-start text-2xl text-warningRed">
      Select Nearby Madical Facilities for Blood Donor Locations
    </p>

    <div v-else class="flex justify-between sm:justify-center sm:gap-32">
      <p class="text-start text-2xl text-warningRed">Blood Donor List</p>
      <button
        @click="donorLoad = false"
        class="px-5 p-1 bg-primary-col rounded-lg text-white"
      >
        back
      </button>
    </div>
    <ul
      v-if="donorLoad"
      :class="donorLoad ? 'block scale-100 w-full' : 'hidden scale-0'"
    >
      <div
        class="transition-all duration-150 flex items-center justify-center pb-10 w-full"
      >
        <div
          class="flex flex-wrap flex-col gap-3 items-center justify-center bg-black/30 p-3 rounded-md overflow-hidden"
        >
          <!-- donor list  -->
          <div
            v-if="donorList.res.data.length > 0"
            class="flex flex-col gap-3 h-[550px] overflow-hidden overflow-y-auto"
          >
            <CommonCardsDonor
              v-for="donor in donorList.res.data"
              :donor="donor"
            />
          </div>

          <div
            v-else
            class="flex flex-col gap-3 h-[150px] w-96 overflow-hidden overflow-y-auto justify-center items-center"
          >
            <p class="font-semibold text-lg text-warningRed">No donor found</p>
          </div>
          <!-- donor list  -->
        </div>
      </div>
    </ul>
    <div
      v-else
      class="flex w-full flex-col-reverse sm:flex-row justify-around max-w-full mx-auto gap-8"
    >
      <div class="w-full flex flex-col gap-5">
        <!-- search box  -->
        <div class="relative bg-white" :key="searchKey">
          <FormInputText
            @update:model-value="getAddressByName"
            v-model="searchString"
            :title="'Search Address'"
            :label="'searchField'"
            :type="'text'"
            :oldValue="searchString"
          />
          <ul
            v-if="setDropdown"
            class="bg-white/80 px-2 h-56 overflow-y-scroll absolute z-10 w-full"
          >
            <li
              @click="setLocationBySearch(item)"
              class="border-b border-b-primaryText/40 py-2 hover:bg-darkGray/20 cursor-pointer"
              v-for="item in dropdownItem"
            >
              {{ item.name }}
            </li>
          </ul>
        </div>

        <GoogleMap
          :key="key"
          @click="setCoords"
          draggable="true"
          api-key="AIzaSyAxPHXcoWF4H-g-8kivUn8FlF2uyvqHZqs"
          style="width: 100%; height: 650px"
          :center="center"
          :zoom="20"
          class="mb-8"
        >
          <Marker
            :clicable="true"
            @position_changed="setCoords"
            :options="markerOptions"
          />
        </GoogleMap>
      </div>
      <!-- form section  -->
      <form
        v-if="loading && shouldSideFormShow"
        @submit.prevent="submit"
        class="flex flex-col gap-3 border rounded px-5 py-7 bg-white"
      >
        <div class="flex flex-col gap-6 relative w-full sm:w-60">
          <FormInputDropdown
            v-model="form.blood_type"
            :title="'Blood Type'"
            :label="'blood_type'"
            :type="'dropdown'"
            :options="bloodCategoryOptions"
            :oldValue="null"
            :error="''"
          />

          <!-- <FormInputText
            v-model="form.bags"
            :key="oldKey"
            :title="'Bags'"
            :label="'bags'"
            :type="'number'"
            :error="''"
            :oldValue="''"
          /> -->

          <FormInputText
            :key="key"
            v-model="form.address"
            :title="'Hospital Address'"
            :label="'address'"
            :type="'text'"
            :error="errors.address"
            :oldValue="mapAddress"
          />

          <!-- <FormInputText
            v-if="authStore.auth.authenticated"
            v-model="form.name"
            :key="oldKey"
            :title="'Name'"
            :label="'name'"
            :type="'text'"
            :error="errors.name"
            :oldValue="oldValue.name"
          />

          <FormInputText
            v-if="authStore.auth.authenticated"
            v-model="form.phone"
            :key="oldKey"
            :title="'Phone'"
            :label="'contact_number'"
            :type="'number'"
            :error="errors.contact_number"
            :oldValue="oldValue.phone"
          /> 

          <FormInputTextArea
            v-model="form.notes"
            :key="oldKey"
            :title="'Notes'"
            :label="'notes'"
            :type="''"
            :error="''"
            :oldValue="oldValue.notes"
          /> 

          <FormInputDropdown
            v-model="form.cost"
            :title="'Cost'"
            :label="'cost'"
            :type="'dropdown'"
            :options="costOptions"
            :oldValue="null"
            :error="''"
          />

          -->
        </div>

        <div class="mt-6">
          <ButtonLoginReg
            :name="'Search for Blood Donor'"
            :runLoader="loader"
          />
        </div>
      </form>
    </div>
  </section>
</template>
