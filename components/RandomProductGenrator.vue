<script setup>
import {useCrud} from '@/composables/useCrud';

const props = defineProps({
    shop: String
})

//dependencies
const {apiVersion, isNearest} = useRuntimeConfig().public;
const crud = useCrud();
let products = ref([])

const getRandomProducts = async(slug) => {


    let nearestProducts= apiVersion+'/vendors/'+slug+'/random-products/10'
    // console.log(nearestProducts);
    await crud.get({path: nearestProducts}).then((response)=>{
    // console.log(response)
    response.res.map(data => {
        products.value.push(data)
    })

    });
}
onMounted((res)=>{

    getRandomProducts(props.shop)
})

</script>

<template>

    <CommonCardsProductCard  v-for="product in products" :key="product.id" :cardData="product" class="min-w-[167px] sm:min-w-[250px]"/>
   
</template>