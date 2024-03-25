<script setup>
import { GoogleMap, Marker } from "vue3-google-map";
import { $fetch, FetchError } from "ofetch";
import { useAuthStore } from "@/stores/authStore";
import { useCrud } from "~~/composables/useCrud";
import { useAddressStore } from "~~/stores/userAddressStore";

const addressStore = useAddressStore();
const { getAddress, setAddress } = addressStore;

const pageData = {
  redirectLink: "/signup",
};

const authStore = useAuthStore();
const crud = useCrud();

const route = useRoute();
const slug = route.params.slug;

let shouldSideFormShow = ref(false);

let location = ref();
let loading = ref(false);
let loader = ref(false);
let vendorProfileLoaded = ref(false);
let streetAddress = ref("");
let setDropdown = ref(false);
let dropdownItem = [];

const { apiVersion, isNearest, defaultLat, defaultLng, defaultZoom } =
  useRuntimeConfig().public;
let path = apiVersion + "/user/delivery-addresses";
const placeApiPath = apiVersion + "/get-addresses-by-string";

let key = ref(1);
let searchKey = ref(1);
let center = ref({ lat: Number(defaultLat), lng: Number(defaultLng) });

const toZoom = ref(Number(defaultZoom));

const markerOptions = ref({
  position: center.value,
  label: "U",
  title: "Your Location",
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

      // center.value = ref({ lat: addressStore.getAddress().lat, lng: addressStore.getAddress().lng })
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

if (route.params.slug == "new" && isNearest == true) {
  shouldSideFormShow.value = false;
} else if (route.params.slug != "new" && isNearest == true) {
  shouldSideFormShow.value = true;
} else if (route.params.slug == "new" && isNearest == false) {
  shouldSideFormShow.value = true;
} else if (route.params.slug != "new" && isNearest == false) {
  shouldSideFormShow.value = true;
}

const form = ref({
  name: null,
  address: null,
  houseNo: null,
  floorNo: null,

  contact_name: null,
  contact_number: null,
  default: true,
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
  name: "",
  address: "",
  houseNo: "",
  floorNo: "",

  contact_name: "",
  contact_number: "",
  default: true,
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
  loading = true;

  if (authStore.auth.authenticated) {
    let deliveryAddress;
    if (/^\d+$/.test(slug)) {
      deliveryAddress = {
        _method: "PUT",
        name: form.value.name,
        contact_name: form.value.contact_name,
        contact_number: form.value.contact_number,
        street_address: form.value.address,
        house_no: form.value.houseNo,
        floor_no: form.value.floorNo,
        latitude: location.value.latitude,
        longitude: location.value.longitude,
        default: isDefault.value,
      };
    } else {
      deliveryAddress = {
        name: form.value.name,
        contact_name: form.value.contact_name,
        contact_number: form.value.contact_number,
        street_address: form.value.address,
        house_no: form.value.houseNo,
        floor_no: form.value.floorNo,
        latitude: location.value.latitude,
        longitude: location.value.longitude,
        default: isDefault.value,
      };
    }

    let addressId;
    await crud
      .store({
        body: deliveryAddress,
        path: path,
      })
      .then((res) => {
        if (res.status == 200) {
          alert("address is collected");
          let address = {
            id: res.res.id,
            add: form.value.address,
            houseNo: form.value.houseNo,
            floorNo: form.value.floorNo,
            lat: location.value.latitude,
            lng: location.value.longitude,
          };

          addressStore.setAddress(address);
          dataLoad();
          router.back();
        }
      });
  } else {
    if (
      form.value !== null &&
      location.value.longitude !== null &&
      location.value.latitude !== null
    ) {
      let address = {
        add: form.value.address,
        houseNo: form.value.houseNo,
        floorNo: form.value.floorNo,
        lat: location.value.latitude,
        lng: location.value.longitude,
      };

      addressStore.setAddress(address);
      router.back();
      // navigateTo(pageData['redirectLink'])
    }
  }
};

const dataLoad = async () => {
  await crud
    .index({
      path: path + "/" + slug,
    })
    .then((res) => {
      console.log(res);
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
  if (addressStore.getAddress().lat) {
    center.value.lat = Number(addressStore.getAddress().lat);
    center.value.lng = Number(addressStore.getAddress().lng);
  }

  loading.value = true;
});

// onMounted(async()=> {
//     mallsOptions.value = [];
//     await crud.index({
//         path : apiVersion+'/shopping-malls/for-select',
//     }).then((res)=>{

//       res.res.map((data)=>{
//           mallsOptions.value.push({'key':data.id,'value':data.name});
//       });

//       isMallsLoaded.value = true;
//     });

//     shopCategoryOptions.value = [];

//     await crud.index({
//         path : apiVersion+'/shop-categories/for-select',
//     }).then((res)=>{

//       res.res.map((data)=>{
//           shopCategoryOptions.value.push({'key':data.id,'value':data.name});
//       });

//       isShopCategoryLoaded.value = true;
//     });

// })

// onMounted(async()=> {

//     await crud.show({path: apiVersion+'/vendor/profile'}).then((res)=>{
//       vendorProfileLoaded.value = true;
//           networkResponse = {
//             'address ': res.res.street_address,
//             'malls': res.res.shopping_mall !== null ? res.res.shopping_mall.id: '',
//             'shopCategory': res.res.shop_categories.map(dt=> dt.id),
//             'shopNo': res.res.shop_no,
//             'floor_no': res.res.floor_no,
//             'name': res.res.name,
//           }
//           mapAddress.value= res.res.street_address
//           responseUpdateKey.value++
//           key.value++
//         })
// })

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
  <p class="pt-28 text-center text-2xl">
    Please Search or Select a location from this map
  </p>
  <section
    class="flex justify-around flex-col-reverse md:flex-row max-w-full mx-auto 2xl:px-8 gap-8 px-4 sm:px-10"
  >
    <div v-if="isNearest" class="w-full flex flex-col gap-5 mt-6">
      <!-- search box  -->
      <div :key="searchKey" class="relative">
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
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="toZoom"
      >
        <Marker
          @click="setCoords"
          :clicable="true"
          @position_changed="setCoords"
          :options="markerOptions"
        />
      </GoogleMap>
    </div>
    <!-- form section -->
    <form
      v-if="loading && shouldSideFormShow"
      @submit.prevent="submit"
      class="flex flex-col w-full gap-3 border rounded mt-10 sm:mt-20 px-5 py-7 md:w-fit"
    >
      <div class="flex flex-col gap-6 relative">
        <FormInputText
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
          v-model="form.contact_name"
          :key="oldKey"
          :title="'Contact Name'"
          :label="'contact_name'"
          :type="'text'"
          :error="errors.contact_name"
          :oldValue="oldValue.contact_name"
        />

        <FormInputText
          v-if="authStore.auth.authenticated"
          v-model="form.contact_number"
          :key="oldKey"
          :title="'Contact Number'"
          :label="'contact_number'"
          :type="'number'"
          :error="errors.contact_number"
          :oldValue="oldValue.contact_number"
        />

        <FormInputText
          :key="key"
          v-model="form.address"
          :title="'Address'"
          :label="'address'"
          :type="'text'"
          :error="errors.address"
          :oldValue="mapAddress"
        />

        <div class="flex gap-5">
          <FormInputText
            :key="key"
            v-model="form.houseNo"
            :title="'House No'"
            :label="'houseNo'"
            :type="'text'"
            :error="errors.houseNo"
            :oldValue="oldValue.houseNo"
          />

          <FormInputText
            :key="key"
            v-model="form.floorNo"
            :title="'Floor No'"
            :label="'floorNo'"
            :type="'text'"
            :error="errors.floorNo"
            :oldValue="oldValue.floorNo"
          />
        </div>

        <FormInputDropdown
          v-if="authStore.auth.authenticated"
          v-model="isDefault"
          :key="oldKey"
          :title="'Default'"
          :label="'default'"
          :type="'dropdown'"
          :options="statusOptions"
          :oldValue="isDefault == undefined ? '' : isDefault"
          :error="''"
        />
        <!-- <VueFilepond
                    v-model="form.logo"
                    key="file1"
                    accept="image/*"
                    :id="'image_upload_thumbnail'"
                    :labelIdle="'Upload Logo'"
                    :multiple="false"
                    />
                  <VueFilepond
                  v-model="form.cover"
                  key="file2"
                  accept="image/*"
                  :id="'image_upload_additional_images'"
                  :labelIdle="'Upload Cover Image'"
                  :multiple="false"
                  /> -->
      </div>

      <!-- <div class="flex text-sm gap-2 items-center">
                    <input type="checkbox">
                    <p class="text-xs text-darkGray">I will not sale any illigal product</p>
                </div> -->
      <div class="mt-6">
        <ButtonLoginReg :name="'submit'" :runLoader="loader" />
      </div>
    </form>
  </section>
</template>
