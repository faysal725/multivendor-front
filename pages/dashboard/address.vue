<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: ["userpanel"],
  middleware: ["auth"],
});

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/delivery-addresses";

let address = ref([]);

const addressLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    if (res.res.length > 0) {
      address.value = [];
      res.res.map((dt) => {
        address.value.push(dt);
      });
    }
  });
};
onMounted(() => {
  addressLoad();
});

const destroyAddress = async (id) => {
  await crud.destroy({ path: path + "/" + id }).then((res) => {
    addressLoad();
    addressStore.loadCoords(true);
  });
};

const setLocation = (dt) => {
  let address = {
    add: dt.street_address,
    houseNo: dt.house_no,
    floorNo: dt.floor_no,
    lat: dt.latitude,
    lng: dt.longitude,
  };

  addressStore.setAddress(address);
};
</script>

<template>
  <div>
    <ul class="grid grid-cols-3 gap-5 px-16 pt-36">
      <li
        @click="setLocation(data)"
        v-for="data in address"
        :key="data.id"
        class="border border-primary-col/20 p-4 rounded-lg relative flex items-start"
      >
        <div class="flex flex-col w-full space-y-2">
          <p class="font-semibold flex items-start gap-2">
            Name: <span class="font-normal">{{ data.name }}</span>
          </p>
          <p class="font-semibold flex items-start gap-2">
            Contact Person:
            <span class="font-normal">{{ data.contact_name }}</span>
          </p>
          <p class="font-semibold flex items-start gap-2">
            Contact Number:
            <span class="font-normal">{{ data.contact_number }}</span>
          </p>
          <p class="font-semibold flex items-start gap-2">
            Address: <span class="font-normal">{{ data.street_address }}</span>
          </p>
        </div>

        <div class="flex gap-3 items-end">
          <NuxtLink :to="'/user-location/' + data.id">
            <div class="text-mediumBlue">
              <PencilSquareIcon class="h-5 w-5" />
            </div>
          </NuxtLink>

          <button @click="destroyAddress(data.id)" class="text-warningRed">
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
