<script setup >
const props = defineProps({
  category: Object,
  perPage: Number,
  vendor: String,
})
import {useCrud} from '@/composables/useCrud';
import {useProductStore} from '@/stores/productStore';
const {apiVersion} = useRuntimeConfig().public;
const crud = useCrud()
const productsLoaded = ref(false)
const products = ref([])

const getProducts = () =>{
    crud.get({path:apiVersion+'/vendors/'+props.vendor+'/products-by-category/'+props.category.slug+'/'+props.perPage}).then((response)=>{
        productsLoaded.value = true
        console.log(response)
        products.value = response.res.data;
    })
}

onMounted(()=>{
    getProducts()
})
</script>

<template>
    
<div v-if="productsLoaded" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-1 w-full">
        
        <CommonCardsProductCard v-if="products.length > 0"  v-for="product in products" :cardData="product" />
        <div v-else class="w-full flex items-center justify-center text-warningRed min-h-[100px] text-center col-span-2">No Product Found</div>
    
</div>
    
</template>