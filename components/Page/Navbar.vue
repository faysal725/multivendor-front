<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/vue/24/outline";
import { UserCircleIcon } from "@heroicons/vue/24/solid";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { useCoordinateStore } from "~~/stores/coordinateStore";
import { useCrud } from "~~/composables/useCrud";

import useDetectOutsideClick from "../../composables/useInput";

const componentRef = ref();

useDetectOutsideClick(componentRef, () => {
  toolTip.value = false;
});

const authStore = useAuthStore();
const crud = useCrud();
const route = useRoute();
const { apiVersion, isNearest } = useRuntimeConfig().public;
const path = apiVersion + "/user";

const coordsStore = useCoordinateStore();
const { getCoords, takeLatLngFormUser } = coordsStore;

const addressStore = useAddressStore();
const {
  getAddress,
  setAddress,
  takeCurrentLatLng,
  getUserCoords,
  loadCoords,
  getCoordinate,
  clearCoords,
} = addressStore;

const { login, logout } = useAuth();

let visible = ref(false);
let authenticated = ref(true);
let toolTip = ref(false);

const scrollY = ref(process.client ? window.scrollY : 0);
if (process.client) {
  window.addEventListener("scroll", () => {
    scrollY.value = window.scrollY;
  });
}

const navigation = [
  {
    name: "Account Info",
    icon: FolderIcon,
    current: false,
    href: "/dashboard",
  },
  {
    name: "Orders",
    icon: FolderIcon,
    current: false,
    href: "/dashboard/orders",
  },
  {
    name: "Wishlist",
    icon: FolderIcon,
    current: false,
    href: "/dashboard/wishlist",
  },
  //   {
  //     name: 'Return',
  //     icon: FolderIcon,
  //     current: false,
  //     href: "#"
  //   },
  {
    name: "Logout",
    icon: FolderIcon,
    current: false,
    href: "#",
  },
];

function logoutUser() {
  logout();
  toolTip.value = false;
  // addressStore.takeCurrentLatLng()
}

let userInfo = ref({
  name: "",
  userImg: null,
});
const userDataLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    userInfo.value.name = res.res.name;
    userInfo.value.userImg = res.res.profile_photo_path;
  });
};

onMounted(() => {
  if (route.name != "index") {
    visible.value = true;
  } else {
    visible.value = false;
  }

  if (authStore.auth.authenticated) {
    userDataLoad();
  }
});

watch(
  () => scrollY,
  () => {
    if (route.name == "index") {
      if (scrollY.value >= 120) {
        visible.value = true;
      } else {
        visible.value = false;
      }
    }
  },
  { deep: true }
);

watch(
  () => route.name,
  () => {
    if (route.name != "index") {
      visible.value = true;
    } else {
      visible.value = false;
    }
  },
  { deep: true }
);

const singUpSingIn = ref(false);

watch(
  () => authStore.auth.authenticated,
  () => {
    if (authStore.auth.authenticated) {
      userDataLoad();
    }
  },
  { deep: true }
);
</script>

<template>
  <main
    ref="componentRef"
    class="px-3 sm:px-8 py-3 relative z-10"
    :class="
      visible === true
        ? 'bg-primary-col'
        : '' || route.name !== 'index'
        ? 'bg-primary-col border-b border-b-secondary-col/20'
        : ''
    "
  >
    <ul
      class="flex items-center justify-center"
      :class="route.name !== 'index' ? '' : ''"
    >
      <!-- logo and dropdown -->
      <li class="flex grow items-center pr-2 gap-2">
        <div class="sm:w-52">
          <NuxtLink
            to="/"
            class="flex items-center flex-col w-full sm:flex-row sm:gap-1"
          >
            <img class="w-8 sm:w-16" src="@/assets/logo.png" alt="" />

            <p class="text-sm sm:text-xl font-medium text-white sm:mt-4">
              Shopelo
            </p>
          </NuxtLink>
        </div>
        <div class="flex items-center justify-center w-full">
          <!-- <div v-if="route.name !== 'index' && isNearest && route.name !== 'user-location-slug'" class="w-[250px] hidden sm:block ml-3">
                     <CommonCurrentLocation />
                    </div>  -->
          <div
            v-if="isNearest && route.name !== 'address-confirmation'"
            class="w-[180px] sm:min-w-[200px] lg:min-w-[320px] block border border-light-border rounded-md"
          >
            <CommonCurrentLocation />
          </div>
        </div>
      </li>

      <li
        v-if="visible && route.name !== 'user-location-slug'"
        class="mx-2 items-center flex w-full md:w-auto md:mr-8"
      >
        <CommonSearchField />
      </li>

      <li v-if="!authStore.auth.authenticated" class="flex gap-2">
        <NuxtLink to="/login" class="hidden xl:block">
          <button
            class="flex gap-x-2 border items-center justify-center transition font-semibold ease-in-out p-1 px-3 rounded-md hover:scale-110 duration-300"
            :class="
              route.name === 'index'
                ? 'text-white hover:bg-white hover:text-black '
                : 'bg-white text-black hover:bg-secondary-col  hover:text-white'
            "
          >
            <ArrowLeftOnRectangleIcon class="h-5 w-5" />
            <span>Sign in</span>
          </button>
        </NuxtLink>

        <NuxtLink to="/signup" class="hidden xl:block">
          <button
            class="flex items-center gap-x-2 transition ease-in-out font-semibold p-1 px-3 rounded-md hover:scale-110 duration-300"
            :class="
              route.name === 'index'
                ? 'text-primaryText bg-white'
                : 'bg-white text-black hover:bg-secondary-col  hover:text-white'
            "
          >
            <UserPlusIcon class="h-5 w-5" />
            <span>Join For Free</span>
          </button>
        </NuxtLink>

        <div class="relative xl:hidden">
          <button
            @click="singUpSingIn = !singUpSingIn"
            class="text-white pl-1 py-1 sm:p-3"
          >
            <EllipsisVerticalIcon
              v-if="authStore.auth.authenticated"
              class="w-8 h-8 hidden"
            />
            <UserPlusIcon v-else class="h-7 w-7" />
          </button>

          <div
            v-if="singUpSingIn"
            class="absolute top-full right-0 w-24 bg-white shadow-md mt-2 rounded-md p-1"
          >
            <NuxtLink to="/login" class="block">
              <button
                class="transition font-semibold ease-in-out p-1 px-3 rounded-full hover:scale-110 duration-300"
                :class="
                  route.name === 'index'
                    ? 'text-primary-col hover:text-black '
                    : 'bg-white text-black hover:bg-secondary-col  hover:text-white'
                "
              >
                Sign in
              </button>
            </NuxtLink>

            <NuxtLink to="/signup" class="block">
              <button
                class="transition ease-in-out font-semibold p-1 px-3 rounded-full hover:scale-110 duration-300"
                :class="
                  route.name === 'index'
                    ? 'text-primary-col'
                    : 'text-primary-col hover:bg-secondary-col  hover:text-white'
                "
              >
                Sign Up
              </button>
            </NuxtLink>
          </div>
        </div>
      </li>

      <li v-if="authStore.auth.authenticated" class="flex gap-2 relative">
        <div
          @click="toolTip = !toolTip"
          class="cursor-pointer text-white md:flex items-center gap-2 hidden"
        >
          <p class="text-logo-col text-xs sm:text-base">
            Welcome <span class="font-medium">{{ userInfo.name }}</span>
          </p>
          <img
            v-if="userInfo.userImg !== null"
            :src="networkImage(userInfo.userImg)"
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
            alt=""
          />

          <UserCircleIcon v-else class="w-10 h-10 text-white" />
        </div>
        <div class="md:hidden">
          <button
            @click="toolTip = !toolTip"
            class="w-full h-full text-white px-2"
          >
            <EllipsisVerticalIcon class="w-6 sm:w-8 h-8" />
          </button>
        </div>

        <ul
          v-if="toolTip"
          class="absolute bg-white w-28 shadow-md top-12 right-0 border border-light-border z-20 px-1 rounded transition-all duration-150"
        >
          <template v-for="item in navigation" :key="item.name">
            <div v-if="!item.children">
              <NuxtLink
                :to="item.href"
                :class="[
                  item.current
                    ? 'bg-secondary-col text-secondary-col'
                    : 'bg-white text-secondary-col hover:bg-skyBlue cursor-pointer  hover:text-gray-900',
                  'group flex w-full items-center rounded-md py-2 px-1 text-sm ',
                ]"
              >
                <p
                  v-if="item.name !== 'Logout'"
                  class="hover:bg-primary-col/10 w-full p-1"
                >
                  {{ item.name }}
                </p>
                <p
                  v-else
                  @click="logoutUser"
                  class="hover:bg-primary-col/10 w-full p-1 font-semibold"
                >
                  {{ item.name }}
                </p>
              </NuxtLink>
            </div>
          </template>
        </ul>
      </li>
    </ul>
  </main>
</template>
