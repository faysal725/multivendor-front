<script setup>
const props = defineProps({
    method: String
})


</script>

<template>
    <div class="flex gap-2 border border-secondary-col/30 text-base text-black w-fit px-2 py-1 rounded">
        <input class=" cursor-pointer" type="radio" name="" :id="props.method">
        <label class="text-black/80" :for="props.method">{{ props.method.name }}</label>
    </div>
</template>