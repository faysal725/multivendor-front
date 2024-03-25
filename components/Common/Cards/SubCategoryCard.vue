<script setup>

const props = defineProps({
    categoryData: Object,
    link: String,
})



</script>


<template>
    <NuxtLink :to="props.link == null ? '#' : props.link" class="w-24 mt-2">
        <div class="shadow-lg rounded-md border border-light-border overflow-hidden bg-white flex flex-col  items-center cursor-pointer hover:shadow-xl transition-all duration-200">
            <div class="w-20 h-20 items-center justify-center flex overflow-hidden">
                <div class="h-14 w-14 p-1"><img class="w-full h-full flex-shrink-0 rounded-full shadow-md" :src="networkImage(props.categoryData.image_path)" alt=""></div>

            </div>
            <p class="text-primary-col text-xs font-semibold sm:mb-4 py-1.5 sm:py-0">{{ props.categoryData.name }}</p>
        </div>
    </NuxtLink>
</template>