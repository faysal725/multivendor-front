<script setup>
import {
  StarIcon,
  ShoppingCartIcon,
  Bars3BottomLeftIcon,
  HeartIcon,
} from "@heroicons/vue/20/solid";
import { stringShortner, calculateDeliveyCharge } from "@/composables/utils";
import { useCartStore } from "@/stores/cartStore";
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";
import { useNotificationStore } from "~~/stores/notificationStore";

const notificationStore = useNotificationStore();
const {
  showNotification,
  hideNotification,
  getNotificationState,
  getNotificationData,
  storeNotificationData,
} = notificationStore;

const props = defineProps({
  cardData: Object,
});

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/user/wishlists";
let product;

if (props.cardData.has_variation) {
  product = {
    id: props.cardData.id,
    slug: props.cardData.slug,
    name: props.cardData.name,
    label: props.cardData.label ? props.cardData.label.name : "",
    price: props.cardData.default_variation.price,
    image: networkImage(props.cardData.thumbnail_path),
    rating: props.cardData.review,
    discountType: props.cardData.default_variation.discount_type,
    discount: props.cardData.default_variation.discount,
    discountPrice: props.cardData.default_variation.discounted_price,
    hasVariation: props.cardData.has_variation,
    allInfo: props.cardData,
  };
} else {
  product = {
    id: props.cardData.id,
    slug: props.cardData.slug,
    name: props.cardData.name,
    label: props.cardData.label ? props.cardData.label.name : "",
    price: props.cardData.price,
    image: networkImage(props.cardData.thumbnail_path),
    rating: props.cardData.review,
    discountType: props.cardData.discount_type,
    discount: props.cardData.discount,
    discountPrice: props.cardData.discounted_price,
    hasVariation: false,
    allInfo: props.cardData,
  };
}

const cartStore = useCartStore();
const { setProduct } = cartStore;

let quantity = ref(1);
let wishList = ref(false);
let variationRaw;

const addToCart = () => {
  setProduct({
    product: props.cardData,
    quantity: quantity.value,
    code: props.cardData.id,
    variationRaw: variationRaw,
  });
};
</script>

<template>
  <div>
    <li
      class="flex flex-col justify-between w-full min-h-[274px] sm:min-h-[347px] rounded-md overflow-hidden snap-center mt-5 relative border border-light-border shadow-md hover:shadow-lg"
    >
      <!-- <NuxtLink :to="'/product/'+props.cardData.slug" > -->
      <div
        class="absolute text-sm sm:text-base top-0 -right-1 bg-primary-col z-10 rounded-bl-xl rounded-tr-xl px-3 text-barley font-medium"
      >
        <p
          v-if="product.discountType == 'Percentage' && product.discount !== 0"
        >
          {{ product.discount }}%
        </p>
        <p v-if="product.discountType == 'Flat' && product.discount !== 0">
          - {{ product.discount }} BDT
        </p>
      </div>

      <div
        v-if="product.label"
        class="absolute text-xs top-0 -left-1 z-10 bg-primary-col rounded-br-xl rounded-tl-xl px-3 py-1 text-barley font-medium"
      >
        {{ product.label }}
      </div>

      <div class="relative">
        <NuxtLink :to="'/product/' + product.slug">
          <div class="w-[164px] sm:w-[220px] mx-auto">
            <img
              class="h-28 sm:h-40 w-full object-scale-down"
              :src="product.image"
              alt=""
            />
          </div>
        </NuxtLink>
        <div class="absolute bottom-2 left-2">
          <ButtonWishList :productId="product.id" />
        </div>
      </div>

      <div class="flex flex-wrap gap-2 px-3 pt-2">
        <p class="text-base font-semibold hidden sm:block">
          {{ stringShortner(product.name, 25) }}
        </p>
        <p class="text-sm font-semibold sm:hidden">
          {{ stringShortner(product.name, 15) }}
        </p>
      </div>

      <div
        class="flex items-center text-secondary-col px-3 pt-1 sm:pt-3 font-bold"
      >
        <div class="flex items-center mr-2">
          <p class="text-sm sm:text-xl text-primary-col font-medium">
            <span class="text-lg">৳</span>
            {{ product.discountPrice ? product.discountPrice : product.price }}
          </p>

          <!-- <span v-if="product.discountPrice !== null" class="mx-2 font-light pt-1">|</span> -->
        </div>
        <!-- {{ product.price }} -->
        <div v-if="product.discountPrice !== null" class="flex items-center">
          <p class="text-sm sm:text-base text-secondary-col font-normal">
            <s> {{ product.price }}</s>
          </p>
        </div>
      </div>
      <!-- rating -->
      <span v-if="product.rating !== null" class="flex items-center px-3 py-1">
        <CommonStar :rating="product.rating" />
      </span>

      <!-- </NuxtLink> -->

      <div v-if="!props.cardData.has_variation">
        <div class="p-2">
          <button
            v-if="
              props.cardData.quantity == null || props.cardData.quantity <= 0
            "
            class="text-xs flex items-center rounded-md justify-center border border-warningRed text-warningRed gap-2 bg-warborder-warningRed hover:bg-transparent hover:text-warningRed transition duration-200 p-1 w-full"
          >
            <ShoppingCartIcon class="w-4 h-4" />
            Out of Stock
          </button>
          <button
            v-else
            @click="addToCart"
            class="text-xs flex items-center rounded-md justify-center border border-primary-col text-white gap-2 bg-primary-col hover:bg-transparent hover:text-primary-col transition duration-200 p-1 w-full"
          >
            <ShoppingCartIcon class="w-4 h-4" />
            Add To Cart
          </button>
        </div>
      </div>
      <div class="p-2" v-else>
        <div v-if="props.cardData.has_variation">
          <NuxtLink
            :to="'/product/' + props.cardData.slug"
            class="text-xs flex items-center p-1 rounded-md justify-center border border-primary-col text-white gap-2 bg-primary-col hover:bg-transparent hover:text-primary-col transition duration-200 w-full"
          >
            <ShoppingCartIcon class="w-4 h-4" />
            View Details
          </NuxtLink>
        </div>
        <button
          v-else
          @click="addToCart"
          class="text-xs flex items-center rounded-md justify-center border border-primary-col text-white gap-2 bg-primary-col hover:bg-transparent hover:text-primary-col transition duration-200 p-1 w-full"
        >
          <ShoppingCartIcon class="w-4 h-4" />
          Add To Cart
        </button>
      </div>
    </li>
  </div>
</template>
