<script setup>
import { ShoppingBagIcon } from "@heroicons/vue/24/solid";
import { useCartStore } from "~~/stores/cartStore";

const cartStore = useCartStore();
const { open, close, getState, getProducts } = cartStore;
const route = useRoute();

const products = getProducts();
const quantity = ref(0);
const subTotal = ref(0);

watch(
  () => products,
  () => {
    quantity.value = products.length;
    let st = 0;
    products.map((dt) => {
      st += dt.quantity * dt.discountedPrice;
    });
    subTotal.value = Math.ceil(st);
  },
  { deep: true }
);

watch(
  () => route.name,
  () => {
    quantity.value = products.length;
    let st = 0;
    products.map((dt) => {
      st += dt.quantity * dt.discountedPrice;
    });
    subTotal.value = Math.ceil(st);
  },
  { deep: true }
);
</script>

<template>
  <section
    @click="cartStore.open()"
    class="fixed z-30 bottom-[10%] right-0 w-24 h-24 flex flex-col justify-between shadow-2xl border border-white cursor-pointer rounded-full overflow-hidden"
  >
    <div class="bg-primary-col h-full flex flex-col justify-center">
      <ShoppingBagIcon class="h-8 text-logo-col" />
      <p class="text-center text-logo-col uppercase font-bold text-xs">
        {{ quantity }} Items
      </p>
    </div>
    <div class="bg-primary-col text-white text-center pb-4">
      <p><span class="text-sm font-medium">৳</span> {{ subTotal }}</p>
    </div>
  </section>
</template>
