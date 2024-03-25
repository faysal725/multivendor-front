<script setup>
import { useCartStore } from "@/stores/cartStore";
import { calculateDeliveyCharge } from "@/composables/utils";
const props = defineProps({
  data: Object,
});
const cartStore = useCartStore();
const { setProduct } = cartStore;
// const selectedColor = ref(props.data.product.colors[0])

const pages = [
  { id: 0, name: props.data.vendor.name, href: "#", current: false },
  { id: 1, name: "Product Details", href: "#", current: false },
  { id: 2, name: props.data.name, href: "#", current: true },
];
let quantity = ref(1);
let price = ref(0);
let code = ref();
let variationRaw;
let discountedPriceWithVariation = ref(0);
let discountWithVariation = ref(0);
let discountTypeWithVariation = ref(0);
if (props.data.has_variation) {
  code.value = props.data.variations[0].variation_code;
}

if (props.data.has_variation) {
  price.value = props.data.variations[0].price;
  discountedPriceWithVariation.value =
    props.data.variations[0].discounted_price;
  discountWithVariation.value = props.data.variations[0].discount;
  discountTypeWithVariation.value = props.data.variations[0].discount_type;
} else {
  price.value = props.data.price;
}
var variation = ref([]);
var variationString = ref("");
const calculatePrice = () => {
  if (props.data.has_variation) {
    let productId = props.data.id;
    let attCode = variation.value
      .map((dt) => {
        return dt.code;
      })
      .join("");
    variationString.value = variation.value
      .map((dt) => {
        return dt.string;
      })
      .join(",");
    code.value = productId.toString() + attCode.toString();
    price.value = props.data.variations
      .map((dt) => {
        if (dt.variation_code == code.value) {
          variationRaw = dt;
          discountedPriceWithVariation.value = dt.discounted_price;
          discountWithVariation.value = dt.discount;
          discountTypeWithVariation.value = dt.discount_type;
          return dt.price;
        } else {
          ("");
        }
      })
      .join("");
  } else {
    variationString.value = "";
    (code.value = ""), (price.value = props.data.price);
  }
};
const addToCart = () => {
  if (props.data.has_variation) {
    setProduct({
      product: props.data,
      quantity: quantity.value,
      code: code.value,
      variationString: variationString.value,
      variationRaw: variationRaw,
    });
  } else {
    setProduct({
      product: props.data,
      quantity: quantity.value,
      code: props.data.id,
      variationRaw: variationRaw,
    });
  }
};
</script>

<template>
  <div class="mt-4 sm-10 md:mt-16 lg:pl-8 xl:pl-0 xl:px-8 lg:mt-0">
    <ProductBradcrumb :pages="pages" />

    <div class="">
      <h1 class="text-3xl font-medium mt-2 tracking-tight text-gray-900">
        {{ props.data.name }}
      </h1>
      <!-- <span class="">
                <img src="../../assets/images/ProductDetails/varified.png" alt="">
            </span> -->
    </div>

    <!-- Reviews -->
    <div class="mt-3">
      <ul class="flex items-center gap-1 text-lg">
        <li v-if="props.data.review" class="flex items-center gap-2">
          <div>
            <img src="../../assets/icons/gStar.png" alt="" />
          </div>
          <div class="font-semibold">{{ Math.floor(props.data.review) }}.0</div>
        </li>

        <li v-else class="text-xs text-warningRed">No Review available</li>

        <a
          v-if="props.data.review"
          href="#reviews"
          class="bg-darkGray/20 text-sm p-1 px-2 rounded ml-3"
          >view all</a
        >
      </ul>

      <div class="text-xs flex items-center gap-1">
        Merchant Rating:
        <span class="text-lg text-warningRed">{{ data.vendor.rating }}%</span>
      </div>
    </div>

    <div class="mt-3">
      <p>{{ props.data.description }}</p>

      <p v-if="props.data.features.length > 0" class="mt-5 font-medium">
        Features
      </p>
      <ul>
        <!-- <table>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    <tr v-for="feature in props.data.features" >
                        <td>{{ feature.value }}</td>
                        <td>{{ feature.value }}</td>
                    </tr>
                </table> -->
        <li v-for="feature in props.data.features">
          <div class="flex items-center gap-3">
            <p class="min-w-[160px] flex items-center justify-between">
              <span class="font-medium text-sm text-darkGray mr-2 col-span-2">{{
                feature.name
              }}</span>
              <span class="col-span-1">:</span>
            </p>

            <span class="text-sm font-normal text-[#6b7280] col-span-41">
              {{ feature.value }}
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- pricing  -->
    <div class="mt-3 border-b border-b-secondary-col/25 pb-5">
      <h2 class="sr-only">Product information</h2>
      <div class="flex items-end gap-1" v-if="props.data.has_variation">
        <p class="text-secondary-col text-lg font-medium">BDT</p>
        <p class="text-3xl font-medium tracking-tight text-gray-900">
          {{ discountedPriceWithVariation }}
        </p>

        <p
          v-if="discountedPriceWithVariation == null"
          class="text-3xl tracking-tight text-darkGray/80"
        >
          {{ price }}
        </p>
        <p v-else class="text-base tracking-tight text-darkGray/80">
          <s> {{ price }} </s>
        </p>

        <sup v-if="discountWithVariation !== 0">
          <p
            v-if="discountTypeWithVariation == 'Percentage'"
            class="text-base tracking-tight text-darkGray/80"
          >
            {{ discountWithVariation }}%
          </p>
          <p v-else class="text-base tracking-tight text-darkGray/80">
            {{ discountWithVariation }}Flat
          </p>
        </sup>
      </div>
      <div v-else class="flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <p class="text-secondary-col text-lg font-medium">BDT</p>
          <p class="text-3xl font-medium tracking-tight text-gray-900">
            {{
              props.data.discounted_price ? props.data.discounted_price : price
            }}
          </p>
        </div>

        <div class="ml-10 flex gap-2">
          <!-- <p v-if="props.data.discounted_price" class="text-3xl  tracking-tight text-darkGray/80"> {{price}} </p> -->
          <p
            v-if="props.data.discounted_price"
            class="text-base tracking-tight text-darkGray/80"
          >
            <s> {{ price }} </s>
          </p>

          <div v-if="props.data.discount !== 0">
            <p
              v-if="props.data.discount_type == 'Percentage'"
              class="text-base tracking-tight text-darkGray/80"
            >
              {{ props.data.discount }}%
            </p>
            <p v-else class="text-base tracking-tight text-darkGray/80">
              {{ props.data.discount }}Flat
            </p>
          </div>
        </div>
      </div>
    </div>

    <ul class="mt-4 flex flex-col gap-4">
      <!-- color  -->
      <li
        v-if="props.data.has_variation"
        v-for="(attribute, index) in props.data.product_attributes"
      >
        <p class="text-secondary-col">{{ attribute.name }}</p>
        <ProductColorVarient
          @vue:updated="calculatePrice"
          v-model="variation[index]"
          v-if="attribute.slug == 'color'"
          :data="attribute"
        />
        <ProductSizeVarient
          @vue:updated="calculatePrice"
          v-model="variation[index]"
          v-else
          :data="attribute"
        />
      </li>

      <li class="flex">
        <!-- <ProductUnit
          v-if="data.quantity !== null || data.quantity < 0"
          v-model="quantity"
        />
        <button
          v-if="data.quantity !== null || data.quantity < 0"
          @click="addToCart"
          class="bg-black text-white p-2 px-6 text-sm font-medium rounded-lg ml-6"
        >
          Add to Cart
        </button>
        <p v-else class="text-lg text-warningRed">Out of stock</p> -->

        <p
          v-if="data.quantity == null || data.quantity <= 0"
          class="text-lg text-warningRed"
        >
          Out of stock
        </p>
        <div v-else class="flex items-center gap-2">
          <ProductUnit v-model="quantity" />
          <button
            @click="addToCart"
            class="bg-black text-white p-2 px-6 text-sm font-medium rounded-lg ml-6 dark:text-gray-200"
          >
            Add to Cart
          </button>
        </div>

        <div class="ml-6 my-auto">
          <ButtonWishList :productId="props.data.id" />
        </div>

        <div class="ml-6 my-auto">
          <ButtonShare :link="data.vendor.slug" />
        </div>
      </li>
      <li class="flex items-center gap-3">
        <p class="text-xs text-secondary-col">A Product of</p>

        <NuxtLink :to="'/shops/' + data.vendor.slug" class="my-2 w-fit">
          <div
            class="flex items-center bg-secondary-col/10 w-fit rounded-full p-1 pr-4 gap-2"
          >
            <img
              class="h-10 bg-white rounded-full"
              :src="networkImage(props.data.vendor.logo_path)"
              alt=""
            />
            <p class="text-xs font-semibold">{{ props.data.vendor.name }}</p>
            <img
              src="../../assets/images/ProductDetails/externalLink.png"
              alt=""
            />
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
