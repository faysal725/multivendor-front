<script setup>
import { ShoppingBagIcon } from '@heroicons/vue/24/solid';
import {useCartStore} from '~~/stores/cartStore';

const cartStore = useCartStore()
const {
    open,
    close,
    getState,
    getProducts,
} = cartStore

const products = getProducts()
const quantity = ref(0)
const subTotal = ref(0)

watch(
	() => products,
	() => {
    quantity.value = products.length;
    let st = 0;
    products.map((dt)=>{
         st += dt.quantity * dt.discountedPrice
         
    })
    subTotal.value = st 
	},
	{deep: true}
)
</script>

<template>
        <section @click="cartStore.open()" class="fixed z-30 bottom-0 left-0 w-full h-12 grid grid-cols-4 bg-white items-center drop-shadow-2xl cursor-pointer" style="box-shadow: 5px 5px 10px gray;">

            <div class="bg-primary-col h-full w-full flex items-center justify-center">
                <p class="text-center text-logo-col uppercase font-semibold">{{ quantity }} Items</p>
            </div>

            <div class="bg-white flex items-center justify-center text-base font-medium w-full h-full col-span-2">
                <p><span class="text-2xl font-medium">৳</span> {{ subTotal }}</p>
            </div>

            <div class="w-full flex items-center justify-center h-full bg-primary-col">
                <img src="@/assets/logo.png" class="h-12 text-logo-col" alt="">
            </div>
            
        </section>
</template>