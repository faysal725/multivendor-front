<script setup>
const props = defineProps({
  orderData: Object,
});

// const emit = defineEmits(['update:modelValue'])

// emit('update:modelValue', data.value)

// let orderInfo =

let orderStatus = ref("");
let paymentStatus = ref("");

if (
  props.orderData["is_accepted"] == false &&
  props.orderData["is_declined"] == false &&
  props.orderData["is_canceled"] == false
) {
  orderStatus.value = "Pending";
} else if (
  props.orderData["is_accepted"] == true &&
  props.orderData["is_declined"] == false &&
  props.orderData["is_delivered"] == false &&
  props.orderData["is_canceled"] == false
) {
  orderStatus.value = "On Progress";
} else if (
  props.orderData["is_accepted"] == false &&
  props.orderData["is_declined"] == true &&
  props.orderData["is_delivered"] == false &&
  props.orderData["is_canceled"] == false
) {
  orderStatus.value = "Declined";
} else if (
  props.orderData["is_accepted"] == true &&
  props.orderData["is_declined"] == false &&
  props.orderData["is_delivered"] == true &&
  props.orderData["is_canceled"] == false
) {
  orderStatus.value = "Completed";
} else if (
  props.orderData["is_accepted"] == true &&
  props.orderData["is_declined"] == false &&
  props.orderData["is_delivered"] == true &&
  props.orderData["is_canceled"] == false
) {
  orderStatus.value = "Completed";
} else if (props.orderData["is_canceled"] == true) {
  orderStatus.value = "Canceled";
} else {
  orderStatus.value = "";
}

// String paymentStatus(order) {
//     if (order['is_paid'] == false) {
//       return "Unpaid";
//     } else {
//       return "Paid";
//     }
//   }

if (props.orderData["is_paid"] == false) {
  paymentStatus.value = "Unpaid";
} else {
  paymentStatus.value = "Paid";
}
</script>

<template>
  <li
    class="border border-primary-col/10 shadow-sm rounded-md p-3 cursor-pointer list-none hover:shadow-xl h-fit"
  >
    <NuxtLink :to="'/dashboard/orders/' + orderData['order_number']">
      <div
        class="flex items-center justify-start flex-wrap gap-8 border-b border-light-border py-2 relative"
      >
        <div class="flex items-start justify-between gap-6">
          <div class="text-xs font-medium text-primaryText/90">
            <p>Order Number</p>
            <p class="text-sm font-base text-primaryText/40">
              #{{ orderData["order_number"] }}
            </p>
          </div>

          <div class="text-xs font-medium text-primaryText/90">
            <p>Date Placed</p>
            <p
              class="text-sm font-base text-primaryText/40 dark:text-gray-200 dark:font-normal"
            >
              <span>{{
                IsoToLocal(orderData["created_at"]).localDateString
              }}</span>
              <br />
              <span>{{
                IsoToLocal(orderData["created_at"]).localTimeString
              }}</span>
            </p>
          </div>

          <div class="text-xs font-medium text-primaryText/90">
            <p>Total Amount</p>
            <p class="text-sm font-base text-primaryText/40">
              {{ orderData["total"] }} BDT
            </p>
          </div>
        </div>

        <p class="bg-green/70 rounded-lg text-xs p-1 px-2 ml-auto text-white">
          {{ orderStatus }}
        </p>
      </div>

      <div
        v-for="item in props.orderData['items']"
        :key="item.id"
        class="flex justify-between"
      >
        <div class="grid grid-cols-12 gap-5 py-3 w-full">
          <div
            class="col-span-12 sm:col-span-4 md:col-span-3 overflow-hidden h-20 xl:col-span-2 border border-light-border rounded-md p-1"
          >
            <img
              class="w-full h-full flex-shrink-0 object-scale-down rounded-md"
              :src="
                item.product ? networkImage(item.product.thumbnail_path) : '#'
              "
              alt=""
            />
          </div>

          <div
            class="col-span-12 sm:col-span-8 md:col-span-9 xl:col-span-10 font-normal text-primaryText mb-8 sm:mb-0"
          >
            <div class="flex justify-between items-center flex-wrap">
              <p>{{ item.name }}</p>
              <p>{{ item.price }} BDT</p>
            </div>
            <p class="text-xs font-normal text-primaryText/70">
              {{ item.product ? item.product.description : "No description" }}
            </p>
          </div>
        </div>
      </div>
    </NuxtLink>
  </li>
</template>
