<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: ["auth"],
});

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/wishlists";

// const path = apiVersion+'/user/delivery-addresses';

let wishList = ref();
let loading = ref(false);

let address = ref([]);

const dataLoad = async () => {
  await crud.index({ path: path }).then((res) => {
    console.log(res.res);

    wishList.value = res.res;
    loading.value = true;
  });
};

const removeFromWishList = async ({ id }) => {
  console.log(id);
  loading.value = false;
  await crud.destroy({ path: path + "/" + id }).then((res) => {
    dataLoad();
  });
};

onMounted(() => {
  dataLoad();
});
</script>

<template>
  <section
    v-if="loading"
    class="px-4 sm:px-8 py-5 w-full flex flex-col gap-5 dark:bg-darkbg min-h-screen"
  >
    <div class="p-4 rounded-md">
      <p class="text-xl font-medium dark:text-overlay mb-3">Wishlist</p>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 col-span-9 2xl:col-span-10 w-full py-1"
      >
        <!-- <CommonCardsProductCard
            v-for="item in data.products"
            :key="item.id"
            :cardData="item" -->

        <div
          class="group relative"
          v-if="wishList.length != 0"
          v-for="(product, index) in wishList"
          :key="product.id"
        >
          <CommonCardsProductCard :cardData="product" />
          <div
            class="scale-0 transition-all duration-100 group-hover:scale-100 absolute top-[146px] right-2 flex items-center justify-center w-6 h-6 bg-primary-col/20 rounded-full"
          >
            <button
              @click="removeFromWishList({ id: product.id })"
              class="text-xs text-red"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-else class="col-span-8 text-center pb-10 pt-16 dark:text-white">
          <div class="flex items-center justify-center">
            <img
              class="h-64"
              src="~~/assets/images/emptyData/emptyDt.png"
              alt=""
            />
            <p class="text-xs text-lightBlack/50">No Item to show</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
