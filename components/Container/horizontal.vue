<script setup>
import { ArrowRightCircleIcon } from '@heroicons/vue/24/solid';
import { getFirstWordInSlash } from '../../composables/utils'
const props = defineProps({
    title: String,
    items: String,
    link: String,
    linkTitle: String,
})

const route = useRoute()

let firstParams = getFirstWordInSlash(route.fullPath)

let containerId = 'container-'+Math.random()

const scroll = (direction) => {
    let scrollOffset;
    if(direction == 'right'){
         scrollOffset = 1000;
    }else{
         scrollOffset = -1000;
    }
    const element = document.getElementById(`${containerId}`);
    
    element.scroll({
    left: element.scrollLeft + scrollOffset,
    behavior: 'smooth'
    });
}



</script>

<template>
    <div class="relative overflow-x-scroll scrollbar-hide pt-4 pb-3 px-3 sm:px-8 group">
        <div class="flex items-center justify-between sticky top-0 left-0">
            <NuxtLink :to="link" class="text-lg sm:text-2xl font-semibold capitalize">{{ title }}</NuxtLink>
            <NuxtLink v-if="link != '' " :to="link" class="text-primary-col text-xs sm:text-sm cursor-pointer border border-primary-col py-1 px-1 sm:px-3 rounded-md hover:bg-primary-col hover:text-white flex items-center justify-center gap-2 transition-all duration-200">
                <ArrowRightCircleIcon class="w-4 h-4 sm:w-5 sm:h-5"/>
                 <p  >{{ linkTitle }}</p>
            </NuxtLink>
        </div>

       <div class="relative sm:group-hover:px-12 transition-all duration-300">
        <ul :id="containerId" class="flex whitespace-nowrap scrollbar-hide my-2 gap-5 w-full overflow-x-scroll"
        >
            <slot />
        </ul>
        <div class="hidden sm:block absolute transition-all duration-100 scale-0 group-hover:scale-100 top-1/2 -translate-y-1/2 cursor-pointer right-6 group-hover:right-2">
            <CommonRightScroller @click="scroll('right')" />
        </div>

        <div class="hidden sm:block absolute transition-all duration-200 scale-0 group-hover:scale-100 top-1/2 -translate-y-1/2 cursor-pointer left-6 group-hover:left-2 rotate-180">
            <CommonRightScroller @click="scroll('left')" />
        </div>
       </div>

    </div>
</template>

