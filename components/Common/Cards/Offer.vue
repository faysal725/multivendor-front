<script setup>
import { ChevronLeftIcon,ChevronRightIcon } from '@heroicons/vue/24/outline';
// Import Swiper Vue.js components
import {Swiper, SwiperSlide} from "swiper/vue";
    // Import Swiper styles
    import "swiper/css";

    import {Navigation,Autoplay} from 'swiper';

    const modules = [
        Navigation,Autoplay
    ];


const props = defineProps({
    offerData: Array,
    title: String
})


</script>

<template>
    <div class="w-full h-[250px] sm:h-[500px] relative">
        <!-- {{ props.offerData }} -->
        <!-- <p v-for="data in props.offerData">{{ data["image_path"] }}</p> -->
        <swiper 
            :modules="modules" 
            :slides-per-view="1"
            :navigation="{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }"
            :loop="true"
            :spaceBetween="20"
            :autoplay="{delay: 2000,disableOnInteraction: false,}"
            class="h-full w-full"
            >
                <swiper-slide v-for="data in props.offerData">
                    <li class="snap-center h-full w-full col-span-4 relative">
                        <NuxtLink :to="data.link" >
                            <img class="h-full w-full object-cover" :src="networkImage(data['image_path'])" alt="">

                            <!-- <div v-else class="bg-[url('../../assets/images/nearestMarket/superMarket.png')] bg-no-repeat bg-cover bg-center py-16 rounded-lg relative min-w-[450px]">
                                <div class="bg-transparent-black/80 w-fit px-3 rounded-lg absolute right-2 bottom-3">
                                    <p class="font-medium text-white text-lg">{{ data.name }}
                                        <span class="font-thin text-sm text-secondary-col px-1">|</span>
                                        <span class="text-sm">{{ data.dist }}</span>
                                    </p>
                                </div>
                            </div> -->
                        </NuxtLink>

                        <div class="w-full md:w-auto absolute top-1/2 -translate-y-1/2 text-center left-1/2 -translate-x-1/2 z-10">
                            <div class="font-bold text-2xl sm:text-3xl md:text-5xl shadow-xl p-2 text-white after:absolute after:inset-0 after:bg-black/10 relative">
                                <h1 class="relative z-10 mb-2">{{ data.message }}</h1>
                                <NuxtLink :to="data.link" class="py-1.5 sm:py-2 px-4 mb-1 text-sm sm:text-lg shadow-xl bg-white rounded-md text-primary-col hover:bg-primary-col hover:text-white transition-all duration-300 font-semibold relative z-10">shop now</NuxtLink>
                            </div>
                        </div>
                    </li>
                </swiper-slide> 
        </swiper>

        <!-- left arrow -->
        <button class="swiper-button-prev absolute text-white bg-darkGray bg-opacity-60 py-3 sm:py-5 px-1 sm:px-2 left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all cursor-pointer">
            <ChevronLeftIcon class="w-6 h-6"/>
        </button>

        <!-- right arrow -->
        <button
            class="swiper-button-next absolute text-white bg-darkGray bg-opacity-60 py-3 sm:py-5 px-1 sm:px-2 right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all cursor-pointer">
            <ChevronRightIcon class="w-6 h-6"/>
        </button>
    </div>
</template>