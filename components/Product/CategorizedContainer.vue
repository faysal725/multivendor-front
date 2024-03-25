<script setup >
import {useCrud} from '~~/composables/useCrud';
import useDetectOutsideClick from '../../composables/useInput'

const componentRef = ref()

useDetectOutsideClick(componentRef, () => { 
    toolTip.value = false
})



const {apiVersion, isNearest} = useRuntimeConfig().public;
const crud = useCrud();

const props = defineProps({
  category: Object,
  shopCategories: Object,
  labels: Object,
  index: Number
})

const randomProductsLoaded = ref(false)
const randomProducts = ref([])
const activeLabel = ref('')
const getRandomProducts= async(shopCategories , label = null) => {
    let path = apiVersion+
    '/products/random-labeled-products/'+JSON.stringify(shopCategories)+'/20';
    if(label != null){
        activeLabel.value = label
        path += '/'+label;
    }
  randomProductsLoaded.value = false
  await crud.get({
    path:path
    
    }).then((res)=>{
        randomProductsLoaded.value = true
        randomProducts.value = res.res
        console.log(randomProducts.value);
  });
}
onMounted((res)=>{
    getRandomProducts(props.shopCategories)
})

</script>
<template>
    <div class=" w-full">
       <div class="flex">
          <div class="w-full border border-primary-col bg-white grid grid-cols-10 gap-1 p-1.5 mt-2">     
            <button @click="getRandomProducts(props.shopCategories , label.id)" v-for="label in props.labels" :class="activeLabel == label.id ? 'text-white font-semibold bg-secondary' : 'text-secondary' " class="border border-secondary p-1  "> {{ label.name }}</button>
          </div>

          <div :class="index % 2 == 0 ? 'order-last -mr-2 rounded-tl-md' : 'order-first -ml-2 rounded-tr-md'" class="text-lg font-medium bg-secondary text-white py-2 px-4 uppercase min-w-[300px] relative z-10 text-center shadow-lg" style="box-shadow: 0 2px 4px 0 rgba(0,0,0,.1);">
            <nuxt-link to="#">
              {{ props.category.name }}
            </nuxt-link>
            <span :class="index % 2 == 0 ? 'order-last listing_tab_last' : 'order-first listing_tab_first'"></span>
          </div>
       </div> 

        <div class="grid grid-cols-12 gap-1">
                <!-- product -->
        <div class="grid grid-cols-8 col-span-10 mt-1">

             <div v-if="randomProducts.length != 0" v-for="product in randomProducts">
                <CommonCardsProductCard :cardData="product" />
             </div>
             <div v-else class="w-full flex items-center justify-center">No Product Found</div>
        </div>
        <!-- product end-->
       
        <!-- network img -->
            <div class="col-span-2 " :class="index % 2 == 0 ? 'order-last' : 'order-first'">
              <img :src="networkImage(props.category.image_path)" class="w-full h-full" alt="">
            </div>
        <!-- network img end-->
        </div>
    </div>
</template>

<style scoped>
.listing_tab_last{
  content: '';
    width: 0;
    height: 0;
    border-bottom: 8px solid transparent;
    bottom: -8px;
    position: absolute;
    border-right: 8px solid #FF9400;
    right: 1px;
    rotate: 271deg;
}
.listing_tab_first{
  content: '';
    width: 0;
    height: 0;
    border-bottom: 8px solid transparent;
    bottom: -8px;
    position: absolute;
    border-left: 8px solid #FF9400;
    left: 1px;
    rotate: 88deg;
}
</style>