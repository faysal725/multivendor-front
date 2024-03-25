<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/dashboard/edit-profile",
  redirectLink2: "/user-location/new",
  redirectLink3: "/dashboard/change-password",
};

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user";

// const path = apiVersion+'/user/delivery-addresses';

let userProfile = ref();
let loading = ref(false);

let address = ref([]);

const dataLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    userProfile.value = res.res;
    loading.value = true;
  });
};

const addressLoad = async () => {
  await crud.index({ path: path + "/delivery-addresses" }).then((res) => {
    if (res.res.length > 0) {
      address.value = [];
      res.res.map((dt) => {
        address.value.push(dt);
      });
    }
  });
};

onMounted(() => {
  dataLoad();
  addressLoad();
});

const destroyAddress = async (id) => {
  await crud
    .destroy({ path: path + "/delivery-addresses/" + id })
    .then((res) => {
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
  <section v-if="loading" class="px-4 md:px-10 pt-28 w-full">
    <p class="text-xl font-semibold mb-5">Profile</p>

    <div class="flex flex-col xl:grid grid-cols-2 gap-5">
      <div
        class="bg-white border border-light-border shadow-sm p-5 text-sm flex rounded-md justify-between items-start"
      >
        <div class="flex items-center gap-5">
          <div
            class="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 rounded-full bg-primaryText/40 overflow-hidden"
          >
            <img
              class="w-full"
              :src="networkImage(userProfile.profile_photo_path)"
              alt=""
            />
          </div>

          <div class="space-y-1">
            <p class="text-lg font-semibold">Personal Details</p>
            <p>
              <span class="font-medium text-base">User Name:</span>
              {{ userProfile.name.toUpperCase() }}
            </p>
            <p>
              <span class="font-medium text-base">Contact No:</span>
              {{ userProfile.phone }}
            </p>
            <p>
              <span class="font-medium text-base">Last Updated:</span>
              {{ userProfile.updated_at }}
            </p>
          </div>
        </div>
        <button></button>
        <NuxtLink :to="pageData.redirectLink" class="hover:underline"
          >Edit</NuxtLink
        >
      </div>

      <div
        class="bg-white border border-light-border rounded-md shadow-sm p-5 text-sm"
      >
        <p class="font-medium text-lg mb-6">Password</p>
        <div class="flex items-center justify-between">
          <p>***********</p>
          <NuxtLink :to="pageData['redirectLink3']" class="hover:underline"
            >Change Password
          </NuxtLink>
        </div>
      </div>

      <div
        class="bg-white border border-light-border rounded-md shadow-sm p-4 text-sm flex justify-between items-start col-span-2"
      >
        <div class="w-full space-y-3 xl:space-y-0 xl:gap-3 xl:grid grid-cols-2">
          <!-- <div class="w-full flex justify-between items-start p-3 border border-light-border rounded-md">
                    <div class="w-full">
                        <p class="font-medium text-lg">Shipping Address</p>
                        <p>Kodomtola club house</p>
                        <p>Dhaka Trunk Rd, Dhaka</p>
                    </div>
                    <button class="hover:underline">Edit</button>
                </div> -->

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
                Address:
                <span class="font-normal">{{ data.street_address }}</span>
              </p>
            </div>
          </li>

          <div class="w-full flex items-center justify-end pt-4">
            <NuxtLink
              :to="pageData.redirectLink2"
              class="px-2 py-1 border rounded-md border-primary-col bg-primary-col text-white font-medium hover:bg-white hover:text-primary-col transition duration-300"
              >Add new Address</NuxtLink
            >
          </div>
        </div>
      </div>
    </div>
  </section>

  <section
    v-else
    class="px-10 pt-28 flex flex-col xl:grid grid-cols-2 gap-4 w-full max-h-3"
  >
    <p class="text-xl font-semibold">Profile</p>
    <ContainerAnimationPulse customClass=" h-[300px] w-full" />

    <ContainerAnimationPulse customClass=" h-[300px] w-full" />

    <ContainerAnimationPulse customClass=" h-[300px] w-full" />
  </section>
</template>
