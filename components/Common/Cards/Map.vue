<script setup>
const props = defineProps({
    description: String
})

</script>

 
<template>
    <div>
        <img class="w-full" src="../../../assets/images/map/map.png" alt="">
        <p class="text-base text-secondary-col my-2">{{ props.description }}</p>
    </div>
</template>