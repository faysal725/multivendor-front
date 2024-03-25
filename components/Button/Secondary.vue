<script setup>

const props = defineProps({
    name: String
})
</script>


<template>
    
    <button class="bg-lightBlack p-2 px-5 rounded-full mt-8 text-sm hover:bg-white hover:text-black border text-white">
        {{ props.name }}
    </button>
</template>