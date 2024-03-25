<script setup>
import { GoogleMap, Polyline, CustomMarker } from "vue3-google-map";
import { useAuthStore } from "~~/stores/authStore";
const authStore = useAuthStore();
const { getUser } = authStore;
const props = defineProps({
  sourceLat: Number,
  sourceLng: Number,
  destinationLat: Number,
  destinationLng: Number,
  orderId: Number,
});
const { backendUrl, apiVersion, googleApiKey } = useRuntimeConfig().public;
const source = { lat: props.sourceLat, lng: props.sourceLng };
let rider = { lat: props.sourceLat, lng: props.sourceLng };

const cameraPosition = ref({ lat: props.sourceLat, lng: props.sourceLng });
const destination = { lat: props.destinationLat, lng: props.destinationLng };
const sourceMarker = ref({
  position: source,
  label: "M",
  title: "Shop Location",
  draggable: false,
});
const destinationMarker = ref({
  position: destination,
  label: "U",
  title: "Customer Location",
  draggable: false,
});

const showMap = ref(false);
let riderPath;
let key = ref(1);
const decodePolyline = (encoded) => {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const path = [];

  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63; // ASCII to integer
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    path.push({ lat: lat * 1e-5, lng: lng * 1e-5 });
  }

  return path;
};
onMounted(async () => {
  networkGet({
    method: "GET",
    heads: {
      Accept: "application/json",
    },
    path:
      backendUrl +
      apiVersion +
      "/get-poly-points/" +
      props.sourceLat +
      "," +
      props.sourceLng +
      "/" +
      props.destinationLat +
      "," +
      props.destinationLng +
      "/" +
      googleApiKey,
  }).then((value) => {
    riderPath = {
      path: decodePolyline(value.res),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    };
  });
  if (process.client) {
    //${authStore.getUser().vendorId}
    console.log(showMap.value, "runn");
    window.Echo.channel(
      `App.Models.User.${authStore.getUser().userid}.Order.${props.orderId}`
    ).listen("RiderLocationUpdatedEvent", (e) => {
      rider.lat = e.location.lat;
      rider.lng = e.location.lng;
      cameraPosition.value = rider;
      if (!showMap.value) {
        cameraPosition.value = source;
        showMap.value = true;
      }
      if (showMap.value) {
        if (rider.lat == 0 && rider.lng == 0) {
          showMap.value = false;
        }
      }
    });
    window.Echo.channel.bind(
      "pusher:subscription_succeeded",
      function (members) {
        alert("successfully subscribed!");
      }
    );
  }
});
</script>

<template>
  {{ showMap }}
  <GoogleMap
    v-if="showMap"
    :key="key"
    :draggable="true"
    :api-key="googleApiKey"
    style="width: 100%; height: 500px"
    :center="cameraPosition"
    :zoom="15"
  >
    <CustomMarker :options="{ position: source }">
      <div style="text-align: center">
        <div style="font-size: 1rem">M</div>
        <img
          src="~/assets/images/map/shop.png"
          width="25"
          height="25"
          style="margin-top: 8px"
        />
      </div>
    </CustomMarker>

    <CustomMarker :options="{ position: destination }">
      <div style="text-align: center">
        <div style="font-size: 1rem">U</div>
        <img
          src="~/assets/images/map/customer.png"
          width="25"
          height="25"
          style="margin-top: 8px"
        />
      </div>
    </CustomMarker>
    <CustomMarker :options="{ position: rider }">
      <div style="text-align: center">
        <div style="font-size: 1rem">U</div>
        <img
          src="~/assets/images/map/delivery.png"
          width="25"
          height="25"
          style="margin-top: 8px"
        />
      </div>
    </CustomMarker>

    <Polyline :clicable="true" :geodesic="true" :options="riderPath" />
  </GoogleMap>
</template>
