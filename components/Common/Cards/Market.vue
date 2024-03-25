<script setup>
const props = defineProps({
    marketData: Object
})
</script>

<template>
    <li class="snap-center list-none">
        <NuxtLink :to="'/malls/'+marketData.slug"  >

            <div style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)" :style="{ 'background-image': 'url(' + networkImage(props.marketData.image_path) + ')' }" class=" bg-no-repeat bg-cover bg-center py-10 rounded-lg relative min-w-[150px] min-h-[150px] sm:min-w-[290px] malls"
            
            >
                <div class="bg-transparent-black/50 px-3 rounded-lg absolute right-1/2 translate-x-1/2 w-full bottom-3">
                    <p class="font-medium text-white text-lg overflow-x-auto scrollbar-hide">{{ marketData.name }}</p>
                </div>


            </div>
        </NuxtLink>
    </li>
</template>


<style>
.malls{
    background-image: url(`${props.marketData.image}`);
}
</style>