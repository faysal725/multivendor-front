<script setup>
import {useCrud} from '~~/composables/useCrud'


const props = defineProps({
    serviceProviding: Boolean
})


const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
// const apiVersion = "/api/v1";

const path = apiVersion+'/shop-categories';
var categoryData = []
var loaded = ref(false);


// onMounted(async()=>{
//     await crud.get({path:path}).then((res)=>{
//         loaded.value= true
//         categoryData = res.res;

//     });
// });
const goto = (item) =>{
    navigateTo('/'+item.slug)
}

</script>

<template>
    <div>
        <div class="pt-16 sm:pt-24 pb-12 heroSection bg-no-repeat bg-cover bg-center px-4 sm:px-8 flex flex-col justify-center items-center">
            <div class="w-full md:w-1/2 hidden sm:block">
                
                <div >
                    <CommonSearchAll v-if="serviceProviding"/>
                    <p v-else class=" text-4xl text-white text-center py-10 sm:py-20"><span class="text-warningRed font-medium">Currently,</span> We are not providing any service in your location.</p>
                </div>

            </div>

            <div v-if="serviceProviding"  class="sm:px-4 relative z-10 w-full">
                <p class="my-10 text-white text-center text-2xl sm:text-3xl">Categories</p>
                <div class="flex sm:justify-center overflow-x-scroll scrollbar-hide w-full sm:w-auto overflow-hidden whitespace-nowrap">
                    <CommonCardsCategory />
                </div>
            </div>

        </div>
    </div>

</template>