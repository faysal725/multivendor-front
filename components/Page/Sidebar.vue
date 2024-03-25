<script setup>


const route = useRoute()
const presentRoute = route.name
const products = [
  {
    id: 1,
    name: 'Black owl tshirt',
    href: '#',
    edition: 'Premium Edition',
    price: '500 BDT',
    color: 'Charcoal',
    size: 'L',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-06-product-01.jpg',
    imageAlt: "Model wearing men's charcoal basic tee in large.",
  },
  {
    id: 1,
    name: 'Black owl tshirt',
    href: '#',
    edition: 'Premium Edition',
    price: '500 BDT',
    color: 'Charcoal',
    size: 'L',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/confirmation-page-06-product-01.jpg',
    imageAlt: "Model wearing men's charcoal basic tee in large.",
  },
  // More products...
]


</script>


<template>
    <div class="overflow-y-scroll  h-full w-full border-t border-t-secondary-col/50 p-5 pb-24	scrollbar-hide
    relative" :class="presentRoute !== 'cart' ? 'bg-white' : 'bg-mediumGray'">

          <div v-if="presentRoute !== 'cart'" class="border border-secondary-col/50 w-fit rounded-full p-1 ml-auto mb-5">
            <SvgComponentCloseIcon 
                
                :height="9" 
                :width="5" 
                :color="'fill-mediumBlue'" 
                />
          </div>
          <!-- button  -->
          <div v-if="presentRoute !== 'cart' " class="flex justify-between">
              <p class="font-semibold">
                Your Items
              </p>
              <button class="text-xs font-medium p-1 px-2 border border-secondary-col rounded-full">
                <span>+</span> Add more items</button>
          </div>


            <!-- cart items  -->
            <ul v-if="presentRoute !== 'cart'" role="list" class="mt-2  text-sm font-medium text-gray-500">
              <CommonCardsCartItems v-for="product in products" :key="product.id" :cartData="product" />

            </ul>

            <div v-if=" rightSidebar === false" class="mt-8">
              
              <div class="mb-5">
                <p class="text-lg font-semibold ">Order Summery</p>
                <p v-if="presentRoute === 'cart'"  class="text-secondary-col text-sm">Checkout from Desh Unimart</p>
              </div>
              

              <ul class="flex flex-col gap-1 border-b border-b-secondary-col/30 my-3 py-3">
                <li class="flex justify-between">
                  <p>1xBlue tshirt</p>
                  <p>TK 600</p>
                </li>

                <li class="flex justify-between">
                  <p>1xBlue tshirt</p>
                  <p>TK 80</p>
                </li>

              </ul>


              <ul class="flex flex-col gap-1">


                <li class="flex justify-between">
                  <p>Subtotal</p>
                  <p>TK 600</p>
                </li>

                <li class="flex justify-between">
                  <p>Delivery fee</p>
                  <p>TK 80</p>
                </li>

                <li class="flex justify-between">
                  <p>Tax</p>
                  <p>TK 6</p>
                </li>

                <li class="flex justify-between font-semibold text-lg border-t border-t-secondary-col/30 my-3 pt-2">
                  <p>Total</p>
                  <p>700 TK</p>
                </li>

                <li class="flex justify-center">
                  <button class="bg-lightBlack py-4 font-semibold w-full rounded-lg text-white">Checkout</button>
                </li>
              </ul>
            </div>
    </div>
</template>