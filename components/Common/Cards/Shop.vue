<script setup>

import { getFirstWordInSlash } from '../../../composables/utils'


const props = defineProps({
    shopData: Object
})

const route = useRoute()

let firstParams = getFirstWordInSlash(route.fullPath)



</script>


<template>
    <NuxtLink :to="'/shops/'+props.shopData.slug">
        <li 
            class="bg-white h-auto flex flex-col items-center shadow-md border border-light-border rounded-lg gap-2 hover:shadow-xl px-4 py-1 snap-center min-h-[114px] sm:min-h-[138px]"
            :class="firstParams !== 'malls min-h-[114px]'? 'min-w-[96px] sm:min-w-[154px] min-h-[111px] sm:min-h-[114px]' : '' " >
                <div class="rounded-full bg-white">
                    <img class="w-14 h-14 sm:w-20 sm:h-20 rounded-full " :src="networkImage(props.shopData.logo_path)" alt="">
                </div>
                
                <div class="py-2">
                    <p class="sm:font-semibold font-medium text-xs sm:text-sm text-darkGray">{{ props.shopData.name }}</p>
                </div>

        </li>
    </NuxtLink>
</template>