<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/order/returns";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/dashboard/order/returns",
};

let allReturnedOrders = ref();
let loading = ref(false);

const dataLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    if (res.status == 200 && res.res.data.length > 0) {
      allReturnedOrders.value = res.res.data;
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
    <p class="text-xl font-semibold">Return</p>

    <ul v-if="loading" class="flex flex-col xl:grid grid-cols-2 gap-5 pb-8">
      <Order
        v-for="data in allReturnedOrders"
        :key="data.id"
        :orderData="data"
      />
    </ul>
  </section>
</template>
