<script setup>

const props = defineProps({
    data: Object
})

const keys = Object.keys(props.data)

</script>


<template>
    <div>
        <p class="text-base font-medium mb-8">{{ props.data.name }}</p>
        <div class="flex items-center justify-between gap-1 px-5 py-4 rounded bg-secondary-col/10 max-w-[55rem]">
            
            <div class="flex items-center gap-3 text-base font-medium">
                <img src="../../assets/images/merchantImg/totalOrder.png" alt="">
                
                <div class="w-24">

                    <p class="">{{ keys[1] }}</p>
                </div>
                <p class="ml-10">{{ props.data[keys[1]].qty }}</p>
            </div>

            <div class="flex items-center gap-3 text-base font-medium">
                <img src="../../assets/images/merchantImg/totalSales.png" alt="">
                <div class="w-24">

                    <p class="">{{ keys[2] }}</p>
                </div>
                <div class="w-20 text-end">
                    <p class="ml-10">{{ props.data[keys[2]].qty }}</p>
                </div>
            </div>
        </div>
    </div>

</template>