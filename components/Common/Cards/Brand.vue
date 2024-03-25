<script setup>

const props = defineProps({
    brandData: Object
})
</script>


<template>
    <li class="w-[192px] mt-4">
        <div class="shadow-lg rounded-md overflow-hidden bg-white flex flex-col gap-3 items-center cursor-pointer hover:shadow-xl transition-all duration-200">
            <div class="w-full h-36 overflow-hidden">
                <!-- <img class="h-full w-full transition-all duration-200 hover:scale-75" :src="categoryData.image" alt=""> -->
            </div>
            <p class="text-primary-col text-sm font-medium mb-3">{{ props.categoryData.name }}</p>
        </div>
    </li>
</template>