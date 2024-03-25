<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/orders";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/dashboard/orders/",
};

let allOrders = ref();
let loading = ref(false);
let filters = ref([
  { name: "All", route: "all" },
  { name: "Accepted", route: "is_accepted" },
  { name: "Declined", route: "is_declined" },
  { name: "Delivered", route: "is_delivered" },
  { name: "Pending", route: "pending" },
  { name: "Cancelled", route: "is_canceled" },
]);

const dataLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    if (res.status == 200 && res.res.data.length > 0) {
      allOrders.value = res.res.data;
      loading.value = true;
    }
  });
};

onMounted(() => {
  dataLoad();
});
</script>

<template>
  <section class="px-4 sm:px-10 pt-28 w-full flex flex-col gap-5">
    <p class="text-xl font-semibold">Orders</p>
    <div class="flex gap-2">
      <NuxtLink
        :to="'/dashboard/orders/filter/' + data.route"
        class="px-2 rounded-md uppercase border transition-all duration-100 bg-white text-overlay hover:bg-overlay hover:text-white"
        v-for="data in filters"
      >
        {{ data.name }}
      </NuxtLink>
    </div>
    <ul v-if="loading" class="flex flex-col xl:grid grid-cols-2 gap-5 pb-8">
      <Order v-for="data in allOrders" :key="data.id" :orderData="data" />
    </ul>

    <div
      v-else
      class="mt-4 flex flex-col xl:grid grid-cols-2 gap-4 w-full max-h-3"
    >
      <ContainerAnimationPulse customClass=" h-[250px] w-full" />

      <ContainerAnimationPulse customClass=" h-[250px] w-full" />

      <ContainerAnimationPulse customClass=" h-[250px] w-full" />

      <ContainerAnimationPulse customClass=" h-[250px] w-full" />
    </div>
  </section>
</template>
