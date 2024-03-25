<script setup>

const props = defineProps({
    title: String,
    edit: Boolean,
})


</script>

<template>
    <div class="border-b border-b-secondary-col/30 pb-6"> 
        <div class="flex justify-between mb-2">
            <p class="text-lg font-medium">{{ props.title }}</p>
            
            <button type="button" v-show="edit === true" class="rounded-full bg-white  px-4 text-xs  text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col/50 hover:bg-gray-50 flex items-center">
                <img src="../../assets/icons/edit.svg" alt="">
                Edit</button>
        </div>
        <slot />
    </div>
</template>