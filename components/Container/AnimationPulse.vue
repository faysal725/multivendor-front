<script setup>
const props = defineProps({
    customClass: String
})
</script>

<template>
    <div class="border border-[#93c5fd] shadow rounded-md p-4 mx-auto" :class="customClass" >
        <div class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-[#94a3b8] h-10 w-10"></div>
            <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-[#94a3b8] rounded"></div>
                <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-[#94a3b8] rounded col-span-2"></div>
                        <div class="h-2 bg-[#94a3b8] rounded col-span-1"></div>
                        <div class="h-2 bg-[#94a3b8] rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-[#94a3b8] rounded"></div>
                </div>
            </div>
        </div>
    </div>
</template>