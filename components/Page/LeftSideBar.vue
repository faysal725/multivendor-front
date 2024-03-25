<script setup>
// setPageLayout('merchant')
import { useAuthStore } from "~~/stores/authStore";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  CreditCardIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ArrowPathIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  PowerIcon,
  MapPinIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();

const { login, logout } = useAuth();

const userPermission = [
  {
    name: "Account Info",
    icon: UsersIcon,
    current: false,
    href: "/dashboard",
  },
  // {
  //     name: 'Address',
  //     icon: MapPinIcon,
  //     current: false,
  //     href: '/dashboard/address'
  // },

  {
    name: "Orders",
    icon: ShoppingBagIcon,
    current: false,
    href: "/dashboard/orders",
  },
  {
    name: "Wishlist",
    icon: ShoppingBagIcon,
    current: false,
    href: "/wishlist",
  },
  {
    name: "Help Center",
    icon: ShoppingBagIcon,
    current: false,
    href: "/dashboard/help-center",
  },
  {
    name: "Donate Blood",
    icon: ArrowPathIcon,
    current: false,
    href: "/dashboard/donate-blood",
  },
  {
    name: "Return",
    icon: ArrowPathIcon,
    current: false,
    href: "/dashboard/return",
  },
];

const verifications = [
  {
    name: "User Block",
    icon: HomeIcon,
    current: false,
    href: "#",
  },
  {
    name: "Shop Verifications",
    icon: HomeIcon,
    current: false,
    href: "#",
  },
];

const features = [
  {
    name: "Event",
    icon: UsersIcon,
    current: false,
    children: [{ name: "Vouchar & Campaign", href: "#" }],
  },
  {
    name: "SnapShot",
    icon: HomeIcon,
    current: false,
    href: "#",
  },
];

const logoutUser = () => {
  logout();
  navigateTo("/login");
};
</script>

<template>
  <div class="">
    <div class="relative overflow-y-scroll scrollbar-hide h-screen">
      <nav
        class="flex-1 space-y-1 overflow-y-scroll scrollbar-hide h-screen bg-white pt-5 p-3 px-5"
        aria-label="Sidebar"
      >
        <div class="py-3">
          <template v-for="item in userPermission" :key="item.name">
            <div v-if="!item.children">
              <NuxtLink
                :to="item.href"
                :class="[
                  item.current
                    ? 'bg-secondary-col/20 text-secondary-col'
                    : 'bg-white  hover:bg-gray-50 hover:text-gray-900',
                  'group flex w-full items-center rounded-md py-2 pl-2 text-base ',
                ]"
              >
                <component
                  :is="item.icon"
                  :class="[
                    item.current
                      ? 'text-gray-500'
                      : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-6 w-6 flex-shrink-0',
                  ]"
                  aria-hidden="true"
                />
                {{ item.name }}
              </NuxtLink>
            </div>

            <Disclosure as="div" v-else class="space-y-1" v-slot="{ open }">
              <DisclosureButton
                :class="[
                  item.current
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex w-full items-center rounded-md py-2 pl-2 pr-1 text-left text-base focus:outline-none focus:bg-secondary-col/20',
                ]"
              >
                <!-- <component :is="item.icon" :class="[item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 h-6 w-6 flex-shrink-0']" aria-hidden="true" /> -->
                <span class="flex-1">{{ item.name }}</span>
                <svg
                  :class="[
                    open ? 'rotate-90 text-gray-400' : 'text-gray-300',
                    'ml-3 h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out group-hover:text-gray-400',
                  ]"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                </svg>
              </DisclosureButton>
              <DisclosurePanel class="space-y-1">
                <DisclosureButton
                  v-for="subItem in item.children"
                  :key="subItem.name"
                  as="a"
                  :href="subItem.href"
                  class="group flex w-full items-center rounded-md py-2 pl-11 pr-2 text-sm font-medium text-secondary-col hover:bg-gray-50 hover:text-gray-900"
                  >{{ subItem.name }}</DisclosureButton
                >
              </DisclosurePanel>
            </Disclosure>
          </template>
        </div>
      </nav>

      <!-- <footer class="absolute bottom-24 left-1/2 -translate-x-1/2">
                <div @click="logoutUser" class="p-3 px-5 flex items-center gap-3 text-secondary-col hover:text-red cursor-pointer transition-all duration-150">
                    <PowerIcon class="h-5 " />
                    <p class=" text-base font-semibold">Log Out</p>
                </div>
            </footer> -->
    </div>
  </div>
</template>
