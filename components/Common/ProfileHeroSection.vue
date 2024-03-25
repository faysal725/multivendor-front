<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
    type: String,
    title: String,
    imagePath: String,
    logo: String,
    vendorDistance: String,
    street_address: String,
})

</script>

<template>
    <main class="relative px-4 pb-4 bg-no-repeat bg-cover bg-[#f1f5f9] pt-6" :class=" props.type === 'shops'? 'pb-28': ''" 

    >
        <section :style="{ 'background-image': 'url(' + props.imagePath + ')' }" class=" py-32 h-[400px] bg-no-repeat bg-cover bg-center rounded-lg">
            <!-- <section class=" py-28 bg-no-repeat bg-cover bg-center rounded-lg" :class="'bg-[url('+`${props.imagePath}`+')]'"> -->
            <div v-if="props.type === 'shops'" class="absolute bottom-8 left-8">
                <img class="rounded-full w-24 h-24 mb-2" :src="props.logo" alt="">
                <p class="font-semibold text-xl sm:text-3xl mb-1">{{ props.title }}</p> 
                <p class="text-sm font-normal flex items-end gap-2">
                    <span><MapPinIcon class="w-5 h-5"/></span>
                    {{ props.vendorDistance }} km away
                </p>           
            </div>
        </section>

       <div class="absolute bottom-4 right-4 bg-[#f1f5f9]/80 rounded-tl-md">
        <div v-if="props.type !== 'shops'" class="justify-center flex py-3">
            <div class=" text-center px-3">
                <p class="text-lg sm:text-2xl font-semibold mb-2">{{props.title}}</p>
                <p class="font-normal text-sm">{{props.street_address}}</p>
            </div>
        </div>
       </div>
    </main>
</template>

