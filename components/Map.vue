<script setup>
import { useCrud } from "~~/composables/useCrud";
import { GoogleMap, Marker } from "vue3-google-map";
import { useAddressStore } from "~~/stores/userAddressStore";

const props = defineProps({
  searchable: Boolean,
});

const addressStore = useAddressStore();
const {
  getAddress,
  setAddress,
  takeCurrentLatLng,
  getUserCoords,
  loadCoords,
  getCoordinate,
} = addressStore;

// const {apiVersion} = useRuntimeConfig().public;
const { apiVersion, isNearest, defaultLat, defaultLng, defaultZoom } =
  useRuntimeConfig().public;
const crud = useCrud();
const emit = defineEmits(["update:modelValue"]);

let loading = ref(false);
//for map
let key = ref(1);
let searchKey = ref(1);

let center = ref({ lat: Number(defaultLat), lng: Number(defaultLng) });

const toZoom = ref(Number(defaultZoom));

const markerOptions = ref({
  position: center.value,
  label: "U",
  title: "You are here",
  draggable: true,
});

let mapAddress = ref("");
let streetAddress = ref("");
var searchString = ref("");
const placeApiPath = apiVersion + "/get-addresses-by-string";
let dropdownItem = [];
let setDropdown = ref(false);
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

let showMap = ref(false);

onMounted(async () => {
  // center.value.lat=Number(addressStore.getAddress().lat)
  //   center.value.lng = Number(addressStore.getAddress().lng)

  // if (addressStore.getAddress().lat) {

  //   center.value.lat=Number(addressStore.getAddress().lat)
  //   center.value.lng = Number(addressStore.getAddress().lng)
  //   toZoom.value = 20
  // }
  // console.log(addressStore.getAddress().address)
  if (addressStore.getAddress().address !== null) {
    center.value.lat = Number(addressStore.getAddress().lat);
    center.value.lng = Number(addressStore.getAddress().lng);
    toZoom.value = 20;
  }

  showMap.value = true;
});

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
    streetAddress.value = mapAddress.value;
    searchString.value = mapAddress.value;
    searchKey.value++;
  });

  center.value = { lat: position.lat, lng: position.lng };
  markerOptions.value = {
    position: position,
    label: "U",
    title: "You are here",
    draggable: true,
  };
  key.value++;
}

async function setLocationBySearch(dt) {
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
      label: "U",
      title: "You are here",
      draggable: true,
    };
    key.value++;
    setDropdown.value = false;
  });
}

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
    });
  }
};
watch(
  () => mapAddress,
  () => {
    emit("update:modelValue", {
      streetAddress: streetAddress.value,
      address: mapAddress.value,
      lat: center.value.lat,
      lng: center.value.lng,
    });
  },
  { deep: true }
);
</script>

<template>
  <div class="w-full flex flex-col gap-5">
    <!-- search box  -->
    <div :key="searchKey" class="relative" v-if="props.searchable">
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
      v-if="showMap"
      class="border border-[#cbd5e1] rounded-md overflow-hidden"
      :key="key"
      @click="setCoords"
      :draggable="true"
      api-key="AIzaSyAxPHXcoWF4H-g-8kivUn8FlF2uyvqHZqs"
      style="width: 100%; height: 600px"
      :center="center"
      :zoom="toZoom"
    >
      >
      <Marker
        :clicable="true"
        @position_changed="setCoords"
        :options="markerOptions"
      />
    </GoogleMap>
  </div>
</template>
