<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/orders";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/dashboard/orders",
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

const dataLoad = async (filter, page) => {
  loading.value = false;
  if (filter == "all") {
    allData();
  } else if (filter == "pending") {
    pendingData(page);
  } else {
    otherFilters(filter, page);
  }
};

onMounted(() => {
  dataLoad(slug, 1);
});

const allData = async () => {
  await crud.index({ path: path }).then((res) => {
    if (res.status == 200 && res.res.data.length > 0) {
      allOrders.value = res.res.data;
      loading.value = true;
    }
  });
};
const pendingData = async (page) => {
  await crud
    .index({
      path:
        path +
        "?filter[is_accepted]=0&filter[is_delivered]=0&filter[is_canceled]=0&filter[is_declined]=0" +
        "&page=" +
        page,
    })
    .then((res) => {
      if (res.status == 200 && res.res.data.length > 0) {
        allOrders.value = res.res.data;
        loading.value = true;
      }
    });
};

const otherFilters = async (filter, page) => {
  await crud
    .index({
      path: path + "/?filter[" + filter + "]=1" + "&page=" + page,
    })
    .then((res) => {
      if (res.status == 200 && res.res.data.length > 0) {
        allOrders.value = res.res.data;
        loading.value = true;
      }
    });
};
</script>

<template>
  <section
    class="px-4 sm:px-10 pt-28 max-w-full flex flex-col gap-5 dark:text-gray-200 dark:pt-28"
  >
    <p class="text-xl font-semibold">Orders</p>

    <div class="flex gap-2">
      <NuxtLink
        :to="'/dashboard/orders/filter/' + data.route"
        class="px-2 rounded-md uppercase border transition-all duration-100"
        :class="
          slug == data.route
            ? 'bg-overlay text-white '
            : 'bg-white text-overlay hover:bg-overlay hover:text-white'
        "
        v-for="data in filters"
      >
        {{ data.name }}
      </NuxtLink>
    </div>
    <ul v-if="loading" class="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <Order v-for="data in allOrders" :key="data.id" :orderData="data" />
    </ul>

    <div v-else class="dark:text-gray-200">
      <p>No Orders to Show</p>
    </div>
  </section>
</template>
