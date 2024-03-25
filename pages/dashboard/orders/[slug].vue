<script setup>
import {
  UserCircleIcon,
  TruckIcon,
  MapPinIcon,
  PrinterIcon,
  ArrowPathIcon,
  StarIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";
// import {dateFormatConverter, getTimeDifference} from '~~/stores/utils';

// import {orderStatusUpdate} from '~~/composables/useStatus'

definePageMeta({
  layout: ["userpanel"],
  middleware: ["auth"],
});

const authStore = useAuthStore();
const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();
const { apiVersion, returnPeriod, cancelPeriod, backendUrl } =
  useRuntimeConfig().public;
const path = apiVersion + "/user";

let loading = ref(false);
let order = ref([]);
let status = ref(null);
let allStatus = ref([]);
let oldStatus = ref();
let lastTimeline = ref();
let orderStatus = ref("");
let modal = ref(false);

let sourceLat = "";
let sourceLng = "";
let destinationLat = "";
let destinationLng = "";
let dropOffPin = "";

let productToReview = ref("");
let rating = ref(1);

const openReturnModal = ref(false);
const form = ref({
  review: null,
  returnNote: null,
});

const showOrderCancelBtn = ref(false);

// time modification
const dateFormatConverter = (originalDateString) => {
  // const originalDateString = "Sun Sep 03 2023 16:37:58 GMT+0600 (Bangladesh Standard Time)";
  const originalDate = new Date(originalDateString);

  const year = originalDate.getFullYear();
  const month = String(originalDate.getMonth() + 1).padStart(2, "0"); // Adding 1 to month since it's zero-indexed
  const day = String(originalDate.getDate()).padStart(2, "0");
  const hours = String(originalDate.getHours()).padStart(2, "0");
  const minutes = String(originalDate.getMinutes()).padStart(2, "0");
  const seconds = String(originalDate.getSeconds()).padStart(2, "0");

  const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  // console.log(formattedDateString);
  return formattedDateString;
};

const getTimeDifference = (dateString1, dateString2) => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  if (isNaN(date1) || isNaN(date2)) {
    throw new Error("Invalid date strings");
  }

  const timeDifferenceMillis = Math.abs(date1 - date2);
  const hours = Math.floor(timeDifferenceMillis / 3600000);
  const minutes = Math.floor((timeDifferenceMillis % 3600000) / 60000);
  const seconds = Math.floor((timeDifferenceMillis % 60000) / 1000);

  return { hours, minutes, seconds };
};
// time modification

const returnButton = ref(false);

const orderLoad = async () => {
  loading.value = false;
  let statusId;
  await crud.index({ path: path + "/orders/" + slug }).then((res) => {
    // console.log(res.res.return_requested_at, Number(returnPeriod));
    if (res.res.return_requested_at == null) {
      let { hours, minutes, seconds } = getTimeDifference(
        res.res.return_requested_at,
        res.res.created_at
      );
      // console.log(res.res.return_requested_at, Number(returnPeriod), hours);
      if (
        hours <= Number(returnPeriod) ||
        res.res.return_requested_at == null
      ) {
        returnButton.value = true;
      }
    } else {
      returnButton.value = false;
    }

    if (
      getTimeDifference(dateFormatConverter(new Date()), res.res.created_at)
        .seconds <= 30
    ) {
      modal.value = true;
    }

    const { hours, minutes, seconds } = getTimeDifference(
      dateFormatConverter(new Date()),
      res.res.created_at
    );
    // console.log(
    //   getTimeDifference(dateFormatConverter(new Date()), res.res.created_at),
    //   res.res.created_at,
    //   "asdfsdf"
    // );
    if (
      hours < 1 &&
      minutes <= Number(cancelPeriod) &&
      res.res.is_canceled == false
    ) {
      showOrderCancelBtn.value = true;
    }

    destinationLat = 23.7545268;
    destinationLng = 90.3893426;

    sourceLat = res.res["vendor"]["latitude"];
    sourceLng = res.res["vendor"]["longitude"];
    order.value = res.res;
    statusId = res.res.status_id;
    lastTimeline.value = order.value.timeline.length;
    loading.value = true;

    if (res.res["is_accepted"] == false && res.res["is_declined"] == false) {
      orderStatus.value = "Pending";
    } else if (
      res.res["is_accepted"] == true &&
      res.res["is_declined"] == false &&
      res.res["is_delivered"] == false
    ) {
      orderStatus.value = "On Progress";
    } else if (
      res.res["is_accepted"] == false &&
      res.res["is_declined"] == true &&
      res.res["is_delivered"] == false
    ) {
      orderStatus.value = "Declined";
    } else if (
      res.res["is_accepted"] == true &&
      res.res["is_declined"] == false &&
      res.res["is_delivered"] == true
    ) {
      orderStatus.value = "Completed";
    } else if (
      res.res["is_accepted"] == true &&
      res.res["is_declined"] == false &&
      res.res["is_delivered"] == true
    ) {
      orderStatus.value = "Completed";
    } else {
      orderStatus.value = "";
    }
  });

  await crud.index({ path: path + "/order-status" }).then((res) => {
    // res.res.map(data => {
    //     allStatus.value.push({'key':data.id,'value':data.name})
    //     if (statusId == data.id) {
    //         oldStatus.value =  {'key':data.id,'value':data.name}
    //     }
    //     loading.value = true
    // })
  });
};

const variations = (dt) => {
  let productVariation;

  if (dt["product_variation"]) {
    dt["product_variation"]["variation_attributes"].map((info) => {
      productVariation +=
        info["product_attribute"]["name"].toString() +
        ": " +
        info["attribute_option"]["label"].toString() +
        ", ";
    });
  } else {
    productVariation = "No Variation";
  }

  return productVariation.replace(/undefined/g, "");
};

onMounted(async () => {
  orderLoad();
});

const acceptOrRemoveOrder = ({ id, type }) => {
  if (type == "accept") {
    // api will be called
  } else {
    // api will be called
  }
};

const isOdd = (number) => number % 2 !== 0;

function printPageArea(areaID) {
  var printContent = document.getElementById(areaID).innerHTML;
  var originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}

watch(
  () => status.value,
  () => {},
  { deep: true }
);

async function requestForRider() {
  await crud
    .store({
      body: {},
      path: path + "/orders/" + slug + "/request-rider",
    })
    .then((res) => {});
}

const submit = async () => {
  const reviewApi =
    apiVersion + "/products/" + productToReview.value.product.slug + "/reviews";
  //   loading.value = true
  await crud
    .store({
      body: {
        star: rating.value,
        comment: form.value.review,
      },
      path: reviewApi,
    })
    .then((res) => {
      console.log(res);
      if (res.status == 200) {
        alert("Review send succefully");
        productToReview.value = "";
      }
    });
};

const paymentMethod = ref("Cash On Delivery");

const selectPayment = (dt) => {
  modal.value = false;
  paymentMethod.value = dt;
};

const sendReturnRequest = async () => {
  // user/order/7PWGIDQV/return
  const returnApi = path + "/order/" + slug + "/return";
  //   loading.value = true
  await crud
    .store({
      body: {
        note: form.value.returnNote,
      },
      path: returnApi,
    })
    .then((res) => {
      console.log(res);
      openReturnModal.value = false;
      form.value.returnNote = null;
      if (res.status == 200) {
        updateTimeline("Return request initiated", "return request sent");
      } else {
        updateTimeline(
          "Return request failed",
          "return request sending failed"
        );
      }
    });
};

const updateTimeline = async (name, description) => {
  await crud
    .store({
      body: {
        name: name,
        description: description,
      },
      path: apiVersion + "/orders" + "/" + slug + "/timeline",
    })
    .then((res) => {
      orderLoad();
    });
};

const cancelOrder = async () => {
  await crud
    .store({
      body: {},
      path: apiVersion + "/user/orders" + "/" + slug + "/cancel",
    })
    .then((res) => {
      showOrderCancelBtn.value = false;
      orderLoad();
    });
};
</script>

<template>
  <div class="min-h-[98vh] relative">
    <div v-if="loading" class="my-5 grid grid-cols-12 gap-4 px-4 sm:px-8 pt-24">
      <div class="w-full col-span-12 lg:col-span-9 2xl:col-span-10">
        <!-- <div class="flex justify-center">
          <img
            src="~~/assets/images/paidSign.png"
            class="h-32 w-32 rotate-[14deg]"
          />
        </div> -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 sm:gap-y-4 sm:gap-x-2 text-primaryText"
        >
          <div class="flex gap-x-2 items-start">
            <TruckIcon class="h-10 w-10 text-primary-col/70" />
            <ul class="text-sm font-medium">
              <li>
                Order# :
                <p class="text-sm text-primaryText/50">
                  Order Id:
                  <span class="text-warningRed font-medium"
                    >#{{ order.order_number }}</span
                  >
                </p>
              </li>
            </ul>
          </div>
          <div class="flex gap-x-2 items-start">
            <TruckIcon class="h-10 w-10 text-primary-col/70" />
            <ul class="text-sm font-medium">
              <li>
                Delivery PIN:
                <span
                  v-if="order.drop_off_pin"
                  class="text-warningRed font-medium"
                  >{{ order.drop_off_pin }}</span
                >
                <span v-else class="text-warningRed text-xs">
                  You will get a delivery pin once a delivery man assigned for
                  you
                </span>
              </li>
            </ul>
          </div>

          <div class="flex gap-x-2 items-start relative">
            <a
              v-if="!order.is_paid"
              :href="backendUrl + '/pay/' + slug"
              class="bg-lightBlack py-4 px-5 rounded text-sm flex justify-center hover:bg-white hover:text-black border cursor-pointer text-white w-full group"
              >Pay Now Using SSL</a
            >

            <img
              v-if="order.is_paid"
              src="~~/assets/images/paidSign.png"
              class="h-20 w-20 rotate-[14deg] absolute -top-6 right-0"
            />
          </div>
          <div class="flex gap-x-2 items-start">
            <MapPinIcon class="w-10 text-primary-col/70" />
            <ul class="text-sm font-medium">
              <li>
                City:
                <span class="font-normal text-primaryText/70">{{
                  order.address
                }}</span>
              </li>
            </ul>
          </div>
          <div class="flex gap-x-2 items-start">
            <button
              @click="orderLoad"
              class="flex border rounded-lg p-1 border-secondary-col/50 hover:border-black group"
            >
              <ArrowPathIcon
                class="h-5 w-5 mt-1 py-1 text-primary-col transition-all duration-150 group-hover:rotate-180"
              />Refresh
            </button>
          </div>
        </div>

        <div class="">
          <CommonDeliveryMap
            :sourceLat="sourceLat"
            :sourceLng="sourceLng"
            :destinationLat="destinationLat"
            :destinationLng="destinationLng"
            :orderId="order.id"
          />
        </div>

        <!-- {{ table }} -->
        <div class="tables">
          <table class="text-center mt-10 w-full min-w-[1200px]">
            <tr class="text-primaryText/50 bg-primary-col/5">
              <th class="p-2">Product Name</th>
              <th v-if="order.is_delivered" class="p-2">Review</th>
              <th class="p-2">Quantity</th>
              <th class="p-2">Price</th>
            </tr>
            <tr
              class="text-sm text-primaryText border-b border-t border-b-primaryText/10 border-t-primaryText/10"
              v-for="data in order.items"
            >
              <td>
                <div class="flex gap-x-5 items-center p-5">
                  <NuxtLink
                    :to="'/product/' + data.product.slug"
                    class="h-14 w-14 p-0.5 border border-light-border rounded-sm"
                  >
                    <img
                      v-if="data.product.thumbnail_path"
                      class="h-full w-full flex-shrink-0"
                      :src="networkImage(data.product.thumbnail_path)"
                      alt=""
                    />
                  </NuxtLink>

                  <div class="text-start">
                    <p>{{ data.name }}</p>
                    <p>{{ variations(data) }}</p>
                  </div>
                </div>
              </td>
              <td v-if="order.is_delivered">
                <button
                  class="px-2 p-1 bg-barley rounded-lg text-xs"
                  @click="productToReview = data"
                >
                  Write a Review
                </button>
              </td>
              <td>{{ data.quantity }}</td>
              <td>{{ data.price }} BDT</td>
            </tr>
            <tr class="text-sm text-primaryText">
              <td class="flex gap-x-5 items-center"></td>
              <td class="text-primaryText/60 font-medium">Subtotal:</td>
              <td class="text-primaryText/60">{{ order.sub_total }} BDT</td>
            </tr>
            <tr
              v-for="conditions in order.conditions"
              class="text-sm text-primaryText"
            >
              <td class="flex gap-x-5 items-center"></td>
              <td class="text-primaryText/60 font-medium">
                {{ conditions.name }} :
              </td>
              <td class="text-primaryText/60">{{ conditions.value }} BDT</td>
            </tr>

            <tr class="text-sm text-primaryText">
              <td class="flex gap-x-5 items-center"></td>
              <td class="text-xl">Total:</td>
              <td class="text-primaryText/60">{{ order.total }} BDT</td>
            </tr>
          </table>
        </div>
      </div>

      <!-- timeline  -->
      <div
        v-if="order.timeline.length > 0"
        class="flex gap-4 justify-between flex-col p-4 roreturnButtonunded-lg bg-gray w-full col-span-12 lg:col-span-3 2xl:col-span-2 mb-20 sm:mb-0"
      >
        <p class="text-xl font-semibold">Timeline</p>

        <div class="flex justify-between flex-col relative">
          <!-- {{ order.timeline }} -->
          <div
            v-for="(data, index) in order.timeline"
            :key="data.id"
            class="grid grid-cols-12"
            :class="isOdd(index) ? '' : ''"
          >
            <div
              class="text-sm col-span-5 text-end font-medium text-primaryText/70"
            >
              <p :class="lastTimeline - 1 > index ? '' : 'text-green'">
                {{ !isOdd(index) ? data.name : "" }}
              </p>
              <p
                :class="lastTimeline - 1 > index ? '' : 'text-green'"
                class="text-sm"
              >
                {{ !isOdd(index) ? data.created_at.slice(0, 10) : "" }}
              </p>
            </div>

            <div
              class="col-span-1 flex flex-col justify-start items-center pt-1.5"
            >
              <span
                class="h-3 w-3 rounded-full"
                :class="
                  lastTimeline - 1 > index ? 'bg-primaryText ' : 'bg-green'
                "
              ></span>

              <span
                v-if="lastTimeline - 1 > index"
                class="h-10 w-0.5 bg-primaryText"
              ></span>
            </div>

            <div
              class="text-sm col-span-5 text-start font-medium text-primaryText/70"
            >
              <p
                :class="lastTimeline - 1 > index ? '' : 'text-green'"
                v-if="isOdd(index)"
              >
                {{ data.name }}
              </p>

              <p
                :class="lastTimeline - 1 > index ? '' : 'text-green'"
                class="text-sm"
              >
                {{ isOdd(index) ? data.created_at.slice(0, 10) : "" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex text-center gap-4 items-center flex-col lg:p-4 p-10 rounded-lg bg-gray col-span-12 lg:col-span-3 2xl:col-span-2 mb-20 sm:mb-0"
      >
        <p>Timeline will be updated please wait or</p>
        <div class="flex items-center gap-3">
          <button
            @click="orderLoad"
            class="flex border rounded-lg p-1 border-secondary-col/50 hover:border-black group"
          >
            <ArrowPathIcon
              class="h-5 w-5 mt-1 py-1 text-primary-col transition-all duration-150 group-hover:rotate-180"
            />Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- return request  -->
    <div v-if="returnButton" class="flex gap-2 py-5 pl-5">
      <button
        v-if="order.is_delivered"
        @click="openReturnModal = true"
        class="flex border border-warningRed rounded-lg p-1 px-2 text-white font-medium text-sm bg-warningRed hover:bg-white hover:text-warningRed"
      >
        Send Return Request
      </button>

      <!-- order cancel btn  -->
      <button
        v-if="showOrderCancelBtn"
        @click="cancelOrder"
        class="bg-warningRed px-3 py-1 text-white rounded-lg font-medium text-sm"
      >
        Cancel Order
      </button>
    </div>
    <!-- return request end -->

    <!-- instruction for a valid return request  -->
    <div
      class="py-5 pl-5 border-4 border-primary-col/50 rounded-lg w-fit p-6 ml-5"
    >
      <p class="text-lg font-medium">Note:</p>
      <ul class="text-sm">
        <li>
          You can return your product within
          <span class="text-lg text-warningRed">{{ returnPeriod }} hours</span>
          after placing order
        </li>
        <li>
          Your can cancel your order within
          <span class="text-lg text-warningRed"
            >{{ cancelPeriod }} minutes</span
          >
          after placing order
        </li>
      </ul>
    </div>

    <!-- review modal  -->
    <div
      v-if="productToReview != ''"
      class="fixed flex justify-center items-center w-full h-full bg-black/20 z-30 top-0 left-0"
    >
      <div class="bg-white min-w-[600px] min-h-[350px] rounded-lg p-3">
        <div class="w-full h-full rounded-lg relative">
          <div class="absolute top-1 right-1" @click="productToReview = ''">
            <XMarkIcon
              class="h-7 w-7 text-warningRed cursor-pointer transition-all duration-100 hover:scale-110"
            />
          </div>

          <div
            class="flex flex-col justify-center items-center w-full h-full gap-10 px-4"
          >
            <form
              @submit.prevent="submit"
              action="#"
              method="POST"
              class="mb-10 w-full"
            >
              <div class="my-8">
                <p class="text-lg font-medium">My Rate</p>

                <div class="flex">
                  <StarIcon @click="rating = 1" class="text-orange h-6" />
                  <StarIcon
                    @click="rating = 2"
                    :class="
                      rating >= 2 ? 'text-orange h-6' : 'text-orange/20 h-6'
                    "
                  />
                  <StarIcon
                    @click="rating = 3"
                    :class="
                      rating >= 3 ? 'text-orange h-6' : 'text-orange/20 h-6'
                    "
                  />
                  <StarIcon
                    @click="rating = 4"
                    :class="
                      rating >= 4 ? 'text-orange h-6' : 'text-orange/20 h-6'
                    "
                  />
                  <StarIcon
                    @click="rating = 5"
                    :class="
                      rating >= 5 ? 'text-orange h-6' : 'text-orange/20 h-6'
                    "
                  />
                </div>
              </div>
              <div class="flex justify-between">
                <p class="text-black/80 font-medium">Review</p>
                <p class="text-secondary-col text-sm">up to 500 words</p>
              </div>

              <div>
                <div class="mt-2">
                  <textarea
                    v-model="form.review"
                    rows="4"
                    name="comment"
                    id="comment"
                    class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 bg-secondary-col/5 ring-inset ring-secondary-col/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset px-3 focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div class="w-full flex items-center gap-5 justify-center">
                <ButtonSecondary
                  @click="sendReturnRequest"
                  :name="'Cancle'"
                  class="w-60 py-3 rounded-md !bg-white !text-primary-col hover:!text-white hover:!bg-primary-col"
                />
                <ButtonSecondary
                  :name="'Submit Review'"
                  class="rounded-md w-60 py-3"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!-- review modal  end-->

    <!-- return Modal -->
    <ContainerModal v-if="openReturnModal" v-model="openReturnModal">
      <div class="w-full">
        <div class="pt-3 pb-5">
          <p class="text-lg font-medium">Explain your reason</p>
        </div>
        <div class="text-xs">
          <p class="pb-1 font-semibold">
            Here is how you can valid your return request
          </p>
        </div>
        <div class="flex justify-between items-end">
          <!-- <p class="text-black font-medium text-xs">
            Note:
            <span class="font-normal text-warningRed"
              >Please Enter Your Bkash no and your reason to return.</span
            >
          </p> -->

          <div class="text-xs">
            <ol>
              <li>1. First please Enter Your Bkash number first.</li>
              <li>2. Second Enter your reason to return</li>
            </ol>
          </div>
          <p class="text-secondary-col text-xs">up to 500 words</p>
        </div>

        <div>
          <div class="mt-2">
            <textarea
              v-model="form.returnNote"
              rows="4"
              name="comment"
              id="comment"
              class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 bg-secondary-col/5 ring-inset ring-secondary-col/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset px-3 focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="w-full flex items-center gap-5 justify-center">
          <ButtonSecondary
            @click="openReturnModal = false"
            :name="'Cancel'"
            class="w-60 py-3 rounded-md !bg-white !text-primary-col hover:!text-white hover:!bg-primary-col"
          />
          <ButtonSecondary
            @click="sendReturnRequest"
            :name="'Submit Note'"
            class="w-60 py-3 rounded-md"
          />
        </div>
      </div>
    </ContainerModal>
  </div>
  <!-- return Modal end-->
</template>

<style scoped>
.tables {
  padding-top: 15px;
  padding-bottom: 15px;
  overflow-x: auto;
  white-space: nowrap;
  width: 100%;
}
</style>
