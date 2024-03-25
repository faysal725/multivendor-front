<script setup>
import { useCrud } from "~~/composables/useCrud";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import { useCartStore } from "~~/stores/cartStore";
import { useAuthStore } from "~~/stores/authStore";
import { calculateDeliveyCharge } from "@/composables/utils";
import { useAddressStore } from "~~/stores/userAddressStore";

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
  getChargeReference,
  checkCartStatus,
  getVendorId,
} = cartStore;

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion, multipleShop, locationBased } = useRuntimeConfig().public;

const path = apiVersion + "/user";
const conditionApi = apiVersion + "/utility";

let showModal = ref(false);
const subTotal = ref(0);
const charge = ref(0);
const youSaved = ref(0);
const products = getProducts();
var mapData = ref({});
const quantity = ref([]);

// coupon variables
let payment = ref({
  method: "",
  show: false,
});

let couponCode = ref("");
let chargeAfterCoupon = ref("");
let isCouponValid = ref(true);
let couponLoad = ref(false);

const couponApplied = ref(false);

let address = ref([]);
let key = ref(12);
let shouldFromOpen = ref(false);
let loading = ref(false);
let showLoad = ref(false);

let readDocuments = ref(false);
let documentData = ref({
  current: null,
  conditionData: "",
  privacyData: "",
  refundData: "",
});

const form = ref({
  name: null,
  address: null,
  houseNo: null,
  floorNo: null,

  contact_name: null,
  contact_number: null,
  default: true,
  zone: "",
});

const errors = ref({
  name: "",
  address: "",
  houseNo: "",
  floorNo: "",
  contact_name: "",
  contact_number: "",
  zone: "",
});

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
  returnLoad();
  conditionLoad();
  policyLoad();
});

onMounted(() => {
  if (!authStore.auth.authenticated) {
    navigateTo("/login");
  }
});

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

const addressLoad = async () => {
  await crud.index({ path: path + "/delivery-addresses" }).then((res) => {
    if (res.res.length > 0) {
      address.value = [];
      res.res.map((dt) => {
        address.value.push(dt);
      });
      loading.value = true;
    }
  });
};

const returnLoad = async () => {
  await crud
    .get({ path: conditionApi + "/return-refund-policy" })
    .then((res) => {
      // console.log(res.res.details);
      documentData.value.refundData = res.res.details;
    });
};

const policyLoad = async () => {
  await crud.get({ path: conditionApi + "/privacy-&-policy" }).then((res) => {
    // console.log(res.res.details);
    documentData.value.privacyData = res.res.details;
  });
};

const conditionLoad = async () => {
  await crud.get({ path: conditionApi + "/terms-&-conditions" }).then((res) => {
    documentData.value.conditionData = res.res.details;
  });
};

onMounted(() => {
  form.value.address = addressStore.getAddress().address;
  form.value.contact_number = authStore.auth.phone;
  form.value.contact_name = authStore.auth.username;
  key.value++;
  cartStore.close();
});

const setLocation = (dt) => {
  let address = {
    id: dt.id,
    add: dt.street_address,
    houseNo: dt.house_no,
    floorNo: dt.floor_no,
    lat: 0,
    lng: 0,
  };

  addressStore.setAddress(address);

  checkoutProducts();
};

async function checkoutProducts() {
  if (!readDocuments.value) {
    alert("Please read terms & condition before placing order");
    return;
  }
  // console.log("asdfsdf");
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
        coupon: couponApplied.value.toString(),
        coupon_details: couponCode.value,
        coupon_amount: chargeAfterCoupon.value.toString(),
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

  let allData = {
    cart: JSON.stringify(sortedData),
    address: addressStore.getAddress().id,
    multipleShop: multipleShop,
    no_broadcast: true,
  };

  let deliveryAdd = apiVersion + "/user/delivery-addresses";

  await crud
    .store({
      body: {
        name: "Delivery Location",
        contact_name: form.value.contact_name,
        contact_number: form.value.contact_number,
        street_address: form.value.address,
        house_no: form.value.houseNo,
        floor_no: form.value.floorNo,
        latitude: addressStore.getAddress().lat,
        longitude: addressStore.getAddress().lng,
        default: false,
      },
      path: deliveryAdd,
    })
    .then(async (res) => {
      console.log(res);

      let address = {
        id: res.res.id,
        add: addressStore.getAddress().address,
        houseNo: "",
        floorNo: "",
        lat: addressStore.getAddress().lat,
        lng: addressStore.getAddress().lng,
      };

      addressStore.setAddress(address);

      await crud
        .store({
          body: {
            "delivry-ref": cartStore.getChargeReference(),
            address: res.res.id,
            multipleShop: multipleShop,
            delivery_charge: cartStore.getDeliveryCharge(),
            cart: JSON.stringify(sortedData),
          },
          path: apiVersion + "/user/orders",
        })
        .then((res) => {
          if (res.res.length > 1) {
            loading.value = true;
            showLoad.value = true;
            setTimeout(() => {
              resetCart();
              getDeliveryCharge();
            }, 2000);
          } else {
            loading.value = true;
            showLoad.value = true;
            setTimeout(() => {
              resetCart();
              navigateTo("/dashboard/orders/" + res.res[0]);
            }, 2000);
          }
        });
    });
}

const setNewLocation = async () => {
  let deliveryAdd = apiVersion + "/user/delivery-addresses";

  console.log(form.value);

  await crud
    .store({
      body: {
        name: "Delivery Location",
        contact_name: form.value.name,
        contact_number: form.value.contact_number,
        street_address: form.value.address,
        house_no: form.value.houseNo,
        floor_no: form.value.floorNo,
        latitude: null,
        longitude: null,
        default: false,
      },
      path: deliveryAdd,
    })
    .then((res) => {
      console.log(res);
      // allData = {
      //     'cart': JSON.stringify(sortedData),
      //     'address': res.res.id,
      //     'multipleShop': multipleShop,

      // }

      let address = {
        id: res.res.id,
        add: res.res.street_address,
        houseNo: res.res.house_no,
        floorNo: res.res.floor_no,
        lat: 0,
        lng: 0,
      };

      addressStore.setAddress(address);
      // loading.value = false
      addressLoad();
      checkoutProducts();
    });
};

const chargeDeductedOnCoupon = async () => {
  couponCode.value = "";
  chargeAfterCoupon.value = "";
  couponLoad.value = true;
  isCouponValid.value = true;
  let couponDt = {
    coupon: couponCode.value,
    total: cartStore.getSubTotal(),
    vendor: cartStore.getVendorId(),
  };

  await crud
    .store({
      body: couponDt,
      path: apiVersion + "/check-coupon",
    })
    .then((res) => {
      couponLoad.value = false;
      if (res.status == 200) {
        if (res.res.discount_type == "Flat") {
          subTotal.value = subTotal.value - res.res.discount;
          chargeAfterCoupon.value = subTotal.value;
          couponApplied.value = true;
        } else if (res.res.discount_type == "Percentage") {
          subTotal.value =
            subTotal.value - subTotal.value * (res.res.discount / 100);
          chargeAfterCoupon.value = subTotal.value;
          couponApplied.value = true;
        }
      } else {
        isCouponValid.value = false;
      }
    });
};

function resetCart() {
  emptyCart();
  checkCartStatus();
  chargeAfterCoupon.value = "";
  payment.value.method = false;
}

const selectPayment = (dt) => {
  payment.value.method = dt;
  checkoutProducts();
};

watch(
  () => mapData.value,
  () => {
    let address = {
      id: null,
      add: mapData.value.address,
      houseNo: null,
      floorNo: null,
      lat: mapData.value.lat,
      lng: mapData.value.lng,
    };

    addressStore.setAddress(address);
    form.value.address = mapData.value.address;
    key.value++;
  },
  { deep: true }
);

watch(
  () => products,
  () => {
    let st = 0;
    let saved = 0;
    products.map((dt) => {
      st += dt.quantity * dt.discountedPrice;
      saved += dt.quantity * dt.price;
    });
    subTotal.value = st;
    youSaved.value = saved - st;
  },
  { deep: true }
);

watch(
  () => addressStore.getAddress().address,
  () => {
    form.value.address = addressStore.getAddress().address;
    form.value.contact_number = authStore.auth.phone;
    form.value.contact_name = authStore.auth.username;
    key.value++;
  },
  { deep: true }
);

watch(
  () => authStore.auth.phone,
  () => {
    form.value.contact_number = authStore.auth.phone;
  },
  { deep: true }
);
</script>

<template>
  <div
    v-if="!showLoad"
    class="pt-28 px-10 grid grid-cols-12 gap-5 h-full pb-40"
  >
    <!-- {{ authStore.auth.phone }} -->
    <div class="col-span-9 flex gap-5">
      <div class="w-full relative h-full">
        <span class="absolute top-0 right-0 w-full h-full z-10"></span>
        <Map v-model="mapData" :searchable="false" />
      </div>

      <div class="flex flex-col gap-3 border rounded px-5 py-7 w-fit">
        <p>Enter Address</p>
        <div>
          <div class="flex flex-col gap-6 pb-6 relative">
            <span class="absolute w-full h-20 z-10 bottom-0"></span>
            <FormInputText
              :key="key"
              v-model="form.contact_name"
              :title="'Contact Name'"
              :label="'contact_name'"
              :type="'text'"
              :error="errors.contact_name"
              :oldValue="form.contact_name"
            />

            <FormInputText
              v-if="form.contact_number !== ''"
              :key="key"
              v-model="form.contact_number"
              :title="'Contact Number'"
              :label="'contact_number'"
              :type="'number'"
              :error="errors.contact_number"
              :oldValue="form.contact_number"
            />

            <FormInputText
              :key="key"
              v-model="form.address"
              :title="'Address'"
              :label="'address'"
              :type="'text'"
              :error="errors.address"
              :oldValue="form.address"
            />
          </div>

          <div>
            <div class="flex gap-5">
              <FormInputText
                v-model="form.houseNo"
                :title="'House No'"
                :label="'houseNo'"
                :type="'text'"
                :error="errors.houseNo"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.floorNo"
                :title="'Floor No'"
                :label="'floorNo'"
                :type="'text'"
                :error="errors.floorNo"
                :oldValue="''"
              />
            </div>

            <div class="text-xs flex items-start gap-1 pt-2">
              <input v-model="readDocuments" type="checkbox" />
              <p>
                I have read the
                <span
                  @click="
                    showModal = true;
                    documentData.current = 'conditionData';
                  "
                  class="hover:underline text-mediumBlue cursor-pointer"
                  >Terms conditions</span
                >,
                <span
                  @click="
                    showModal = true;
                    documentData.current = 'privacyData';
                  "
                  class="hover:underline text-mediumBlue cursor-pointer"
                  >Privacy Policy</span
                >,
                <span
                  @click="
                    showModal = true;
                    documentData.current = 'refundData';
                  "
                  class="hover:underline text-mediumBlue cursor-pointer"
                  >Return Refund Policy</span
                >
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <ButtonLoginReg @click="checkoutProducts" :name="'Place Order'" />
        </div>
      </div>
    </div>

    <div class="p-5 rounded-md col-span-3 flex flex-col h-[70vh]">
      <div class="flex flex-col gap-4 h-96 overflow-y-scroll scrollbar-hide">
        <div
          v-for="(product, index) in products"
          :key="product.id"
          class="grid grid-cols-11 gap-1"
        >
          <div class="col-span-2 flex justify-center">
            <img class="object-cover" :src="product.image" alt="" />
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
            class="col-span-2 flex-col flex items-end text-xs cursor-default"
          >
            <div>
              <p
                v-if="product.discountedPrice != 0"
                class="flex flex-col items-end"
              >
                <span class="font-medium">
                  ৳
                  {{ product.discountedPrice }}
                </span>
                <s class="text-[.60rem]">
                  ৳
                  {{ product.price }}</s
                >
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

      <div class="mt-auto">
        <ul class="pt-7 flex flex-col gap-2 font-medium">
          <!-- coupon code  -->
          <li class="flex flex-col justify-between bg-primary-col/10 p-2 gap-1">
            <div class="flex justify-between items-center gap-4">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Enter Coupon Code"
                class="bg-white border border-black/20 rounded-sm text-xs text-black font-normal p-1 px-3 grow outline-none"
              />

              <button
                @click="chargeDeductedOnCoupon"
                class="border p-1 px-3 text-xs rounded-sm transition-all duration-150 hover:bg-black hover:text-white"
              >
                Apply
              </button>
            </div>

            <CommonLoader :runLoader="couponLoad" />

            <p
              v-if="!isCouponValid"
              class="text-warningRed text-xs font-normal"
            >
              Coupon isnt valid
            </p>
          </li>

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
            <p v-if="chargeAfterCoupon == ''">
              <span class="text-xl font-semibold pr-1">৳</span>{{ getTotal() }}
            </p>

            <p v-else>
              <span class="text-xl font-semibold pr-1">৳</span>
              {{ getTotal() - getSubTotal() + chargeAfterCoupon }}
            </p>
          </li>

          <li
            v-if="chargeAfterCoupon != ''"
            class="flex justify-between items-center border-b border-b-overlay/30"
          >
            <p>
              After
              <span class="text-warningRed text-xs italic">{{
                couponCode
              }}</span>
              Apply
            </p>
            <p>
              <span class="text-xl font-semibold pr-1">৳</span>{{ subTotal }}
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
        </ul>
      </div>
    </div>
  </div>

  <div
    @click="showModal = false"
    v-if="showModal"
    class="fixed flex justify-center items-center top-0 right-0 bg-primaryText/20 w-full h-full z-40"
  >
    <div
      class="bg-steel w-96 h-96 flex flex-col gap-3 items-center justify-start rounded px-4 pt-5"
    >
      <div class="overflow-y-scroll text-sm">
        <CommonDescriptionStyler :text="documentData[documentData.current]" />
      </div>
      <div class="pb-3 flex justify-end w-full mt-auto">
        <button
          @click="readDocuments = true"
          class="p-1 px-3 rounded-lg bg-primary-col text-white text-sm"
        >
          I Agreed
        </button>
      </div>
    </div>
  </div>
</template>
