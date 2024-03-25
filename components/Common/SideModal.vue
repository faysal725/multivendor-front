<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon, CreditCardIcon } from "@heroicons/vue/24/outline";
import { CheckIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { useCartStore } from "~~/stores/cartStore";
import { useAddressStore } from "~~/stores/userAddressStore";
import { useAuthStore } from "~~/stores/authStore";
import { calculateDeliveyCharge } from "@/composables/utils";
// import useDetectOutsideClick from '../../composables/useInput';

const authStore = useAuthStore();

const { getUser } = authStore;

import { useCrud } from "~~/composables/useCrud";

const crud = useCrud();
const { apiVersion, multipleShop, locationBased } = useRuntimeConfig().public;
// const apiVersion = "/api/v1";

const path = apiVersion + "/shop-categories";

const addressStore = useAddressStore();
const { getAddress, setAddress } = addressStore;

const cartStore = useCartStore();
const {
  open,
  close,
  getState,
  setProduct,
  getProducts,
  removeProduct,
  emptyCart,
  setProducts,
  getTotal,
  setSubTotal,
  getSubTotal,
  getDeliveryCharge,
  checkCartStatus,
} = cartStore;

const subTotal = ref(0);
const youSaved = ref(0);
const emit = defineEmits(["updateInput"]);
const products = getProducts();
let checkoutDisabled = ref(false);
let showLoad = ref(false);
let loading = ref(false);

let payment = ref({
  method: "",
  show: false,
});

let creditCardForm = ref({
  name: null,
  cardNo: null,
  code: null,
  expMonth: null,
  expYear: null,
});

// const componentRef = ref()

// useDetectOutsideClick(componentRef, () => {
//   // cartStore.close()
//
// })

onMounted(() => {
  if (products.length == 0) {
    localStorage.getItem("cart");
    var localProducts = JSON.parse(localStorage.getItem("cart"));
    if (localProducts != null) {
      localProducts.map((dt) => {
        setProduct({
          product: dt.raw.product,
          quantity: dt.raw.quantity,
          code: dt.raw.code,
          variation: dt.raw.variation,
        });
      });
    }
  }
});
const quantity = ref([]);
watch(
  () => products,
  () => {
    setSubTotal();
    checkCartStatus();
    // products.map((dt) => {
    //   st += dt.quantity * dt.discountedPrice
    //   saved += dt.quantity * dt.price
    // })
    // subTotal.value = st
    // grandTotal.value = st+ getDeliveryCharge()
  },
  { deep: true }
);

const func = (product, operator) => {
  if (operator == "+") {
    product.quantity++;
    calculateDeliveyCharge({ data: product.raw.product, quantity: 1 });
  }
  if (operator == "-") {
    if (product.quantity > 1) {
      product.quantity--;
      calculateDeliveyCharge({
        data: product.raw.product,
        quantity: 1,
        deduct: true,
      });
    } else {
      product.quantity = 1;
    }
  }
};

function paymentByCard(dt) {
  navigateTo("/order-details");
}

async function checkoutProducts() {
  let data = getProducts();
  let sortedData = [];

  data.forEach((item) => {
    let foundVendor = sortedData.find(
      (vendor) => vendor.vendor_id === item.vendor_id
    );

    if (foundVendor) {
      foundVendor.products.push(item);
    } else {
      sortedData.push({
        vendor_id: item.vendor_id,
        products: [item],
      });
    }
  });

  let addressDetails = {
    id: addressStore.getAddress().id,
    address: addressStore.getAddress().address,
    houseNo: addressStore.getAddress().houseNo,
    floorNo: addressStore.getAddress().floorNo,
    lat: addressStore.getAddress().lat,
    lng: addressStore.getAddress().lng,
  };

  var allData = {
    cart: JSON.stringify(sortedData),
    address: addressStore.getAddress().id,
    multipleShop: multipleShop,
    delivery_charge: cartStore.getDeliveryCharge(),
  };
  navigateTo("/address-confirmation");
  // if (authStore.auth.authenticated) {
  //   // && payment.value.method != ""

  //   navigateTo("/address-confirmation");
  //   // if (payment.value.method == "") {
  //   //   payment.value.show = true
  //   //   return
  //   // }

  //   // loading.value = true;
  //   // if (payment.value.method == 'Cash On Delivery') {

  //   //   checkoutDisabled.value = true
  //   //   // console.log(addressStore.getAddress().id == null)
  //   //   if (addressStore.getAddress().id == null) {

  //   //     let deliveryAdd = apiVersion+'/user/delivery-addresses'

  //   //     await crud.store(
  //   //       {
  //   //         body: {
  //   //               "name": authStore.getUser().username,
  //   //               "contact_name": authStore.getUser().username,
  //   //               "contact_number": authStore.getUser().phone,
  //   //               "street_address": addressStore.getAddress().address,
  //   //               "house_no":"",
  //   //               "floor_no":"",
  //   //               "latitude": addressStore.getAddress().lat,
  //   //               "longitude": addressStore.getAddress().lng,
  //   //               "default":false
  //   //           },
  //   //         path: deliveryAdd
  //   //       }).then(async(res) => {

  //   //         console.log(res.res.id)

  //   //         let address = {
  //   //         'id': res.res.id,
  //   //         'add': addressStore.getAddress().address,
  //   //         'houseNo': "",
  //   //         'floorNo': "",
  //   //         'lat': addressStore.getAddress().lat,
  //   //         'lng': addressStore.getAddress().lng,
  //   //         }

  //   //         addressStore.setAddress(address)
  //   //         navigateTo("/address-confirmation")
  //   //       // await crud.store(
  //   //       // {
  //   //       //   body: {
  //   //       //   'address': res.res.id,
  //   //       //   'multipleShop': multipleShop,
  //   //       //   'delivery_charge' : cartStore.getDeliveryCharge(),
  //   //       //   'cart': JSON.stringify(sortedData)
  //   //       //   },
  //   //       //   path: apiVersion+'/user/orders'
  //   //       // }
  //   //       // ).then((res) => {
  //   //       //   if (res.res.length > 1) {
  //   //       //     loading.value = true
  //   //       //     showLoad.value = true
  //   //       //     setTimeout(() => {
  //   //       //       resetCart()
  //   //       //       getDeliveryCharge()          }, 2000)
  //   //       //   }else{
  //   //       //     loading.value = true
  //   //       //     showLoad.value = true
  //   //       //     setTimeout(() => {
  //   //       //       resetCart()
  //   //       //       navigateTo("/dashboard/orders/"+res.res[0])
  //   //       //     }, 2000)
  //   //       //   }
  //   //       // })
  //   //     })
  //   //   }
  //   //   else{
  //   //     await crud.store(
  //   //     {
  //   //       body: allData,
  //   //       path: apiVersion+'/user/orders'
  //   //     }
  //   //     ).then((res) => {
  //   //       if (res.res.length > 1) {
  //   //         showLoad.value = true
  //   //         setTimeout(() => {
  //   //           resetCart()
  //   //           cartStore.getDeliveryCharge()          }, 2000)
  //   //       }else{
  //   //         showLoad.value = true
  //   //         setTimeout(() => {
  //   //           resetCart()
  //   //           navigateTo("/dashboard/orders/"+res.res[0])
  //   //         }, 2000)
  //   //       }
  //   //     })
  //   //   }

  //   // }else{
  //   //   paymentByCard(allData)
  //   // }
  // } else {
  //   navigateTo("/login");
  // }
}

let couponAmount = 10;
let couponCode = ref("");
let chargeAfterCoupon = ref("");

let isCouponValid = ref();

const chargeDeductedOnCoupon = () => {
  subTotal.value = subTotal.value - subTotal.value * (couponAmount / 100);
  chargeAfterCoupon.value = subTotal.value;
};

function resetCart() {
  emptyCart();
  checkCartStatus();
  chargeAfterCoupon.value = "";
  payment.value.method = false;
}

// watch(
// () => addressStore.getAddress(),
// () => {

//   if (products.length > 0 && locationBased == true) {

//     if (confirm("Cart will be empty if location is changed") == true) {
//       emptyCart()
//       payment.value.method = false
//     }

//   }
// },
// {deep: true}
// )
</script>

<template>
  <!-- ref="componentRef" -->
  <section
    class="h-full w-[360px] fixed top-0 right-0 z-40 transition-all duration-150 rounded-l-lg overflow-y-scroll scrollbar-hide drop-shadow-2xl bg-white"
    :class="cartStore.getState() ? 'translate-x-93' : 'translate-x-full'"
  >
    <div
      class="flex justify-between items-center sticky top-0 right-0 border-b border-light-border py-2 px-2 bg-white"
    >
      <p class="text-base font-medium">Shopping Cart</p>
      <button
        @click="resetCart()"
        class="border border-red rounded-md text-xs sm:text-sm font-semibold hover:bg-red hover:text-white px-2 py-1 text-red"
      >
        Remove All
      </button>
      <button
        class="p-1 rounded-md border border-red text-red hover:bg-red hover:text-white"
        @click="cartStore.close()"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- cart Product section  -->
    <div
      class="relative flex h-[90vh] my-8 px-2 flex-col justify-between gap-5 overflow-hidden -z-10"
    >
      <div class="h-auto overflow-scroll scrollbar-hide space-y-2">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="grid grid-cols-11 items-center gap-1"
        >
          <div class="col-span-2 flex justify-center h-[50px] rounded-md overflow-hidden">
            <img class="object-scale-down w-full h-full" :src="product.image" alt="" />
          </div>
          <div class="col-span-4 font-thin">
            <p class="text-wrap text-xs">{{ product.name }}</p>
            <p class="text-xs">{{ product.variation }}</p>
          </div>
          <div class="col-span-2 flex items-start justify-around">
            <button @click="func(product, '-')" class="font-medium">-</button>
            <p class="text-xs font-medium pt-1 cursor-default">
              {{ product.quantity }}
            </p>
            <button @click="func(product, '+')" class="font-medium">+</button>
          </div>

          <div
            class="col-span-2 flex-col flex items-end text-sm cursor-default"
          >
            <div>
              <p v-if="product.discountedPrice != 0" class="flex items-end">
                ৳
                {{ product.discountedPrice }}
              </p>
              <p v-else>{{ product.price }}</p>
            </div>
          </div>
          <div class="col-span-1 flex justify-end cursor-pointer">
            <TrashIcon
              @click="removeProduct(index)"
              class="h-4 w-5 text-warningRed transition-all duration-100 hover:scale-125"
            />
          </div>
        </div>
      </div>

      <div>
        <ul class="flex flex-col gap-2 font-medium">
          <!-- coupon code  -->
          <!-- <li class="flex flex-col justify-between   bg-primary-col/10 p-2 gap-1">
            <div class="flex justify-between items-center gap-4">

              <input v-model="couponCode" type="text" placeholder="Enter Coupon Code" class="bg-white border border-black/20 rounded-sm text-xs text-black font-normal p-1 px-3 grow outline-none">
              
              <button @click="chargeDeductedOnCoupon" class="border p-1 px-3 text-xs rounded-sm transition-all duration-150 hover:bg-black hover:text-white">Apply</button>
            </div>

            <p v-if="isCouponValid" class="text-warningRed text-xs font-normal">Coupon isnt valid</p>

          </li> -->

          <li
            class="flex justify-between items-center border-b border-b-overlay/30"
          >
            <p>Product Total</p>
            <p v-if="chargeAfterCoupon != ''">
              <span class="text-xl font-semibold pr-1">৳</span>
              <s>{{ getSubTotal() }}</s>
            </p>
            <p v-else>
              <span class="text-xl font-semibold pr-1">৳</span
              >{{ getSubTotal() }}
            </p>
          </li>
          <li
            class="flex justify-between items-center border-b border-b-overlay/30"
          >
            <p>Delivery Charge</p>
            <p>
              <span class="text-xl font-semibold pr-1">৳</span
              >{{ getDeliveryCharge() }}
            </p>
          </li>
          <li
            class="flex justify-between items-center border-b border-b-overlay/30"
          >
            <p>Total</p>
            <p>
              <span class="text-xl font-semibold pr-1">৳</span>{{ getTotal() }}
            </p>
          </li>

          <li
            v-if="chargeAfterCoupon != ''"
            class="flex justify-between items-center border-b border-b-overlay/30"
          >
            <p>Charge After Apply Coupon</p>
            <p>
              <span class="text-xl font-semibold pr-1">৳</span
              >{{ chargeAfterCoupon }}
            </p>
          </li>

          <li
            v-if="payment.method != ''"
            class="flex justify-start items-center"
          >
            <p class="text-xs font-normal">
              Payment Method:
              <span
                class="text-warningRed font-medium cursor-pointer hover:underline"
                @click="payment.show = true"
                >{{ payment.method }}</span
              >
            </p>
          </li>

          <li class="mt-10 text-center text-sm flex flex-col gap-2">
            <ButtonPrimary
              @click="checkoutProducts"
              :name="payment.method != '' ? ' Confirm Order' : 'Checkout'"
              :runLoader="loading"
              :isDisable="checkoutDisabled"
              class="bg-primary-col"
            />
            <!-- <p class="cursor-pointer">Or
              <NuxtLink to="/">
                <span class="text-mediumBlue hover:underline">continue Shopping</span>
              </NuxtLink>
            </p> -->
          </li>
        </ul>
      </div>

      <!-- payment  -->
      <div
        v-if="products.length > 0"
        :class="payment.show ? '' : 'translate-y-full'"
        class="absolute bottom-0 w-full flex items-end transition-all duration-150"
        @click="payment.show = false"
      >
        <div
          class="flex flex-col items-center gap-5 bg-steel rounded-md h-80 w-full p-5"
        >
          <p class="text-lg text-primary-col">Select Payment Method</p>

          <ButtonPrimary
            @click="payment.method = 'Cash On Delivery'"
            :name="'Cash on Delivery'"
          />

          <ButtonPrimary
            @click="payment.method = 'Pay with Card'"
            :name="'Pay Now Using SSL'"
          />
        </div>
      </div>
    </div>
  </section>

  <div v-if="showLoad" class="fixed top-0 right-0 bg-white w-full h-full z-40">
    <PageLoad />
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
