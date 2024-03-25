<script setup>
import { StarIcon  } from '@heroicons/vue/20/solid'
const props = defineProps({
    rating: Number
})
const rating = ref(0);
onMounted(()=>{
    
     rating.value = Math.ceil(props.rating);
})
</script>

<template>
    <div class="flex" >
         <!-- <StarIcon v-for="i in rating" class="text-orange h-4 w-4 mr-0.5"/> -->
         <StarIcon v-for="rate in [ 1, 2, 3, 4, 5]" :key="rate" :class="[rating >= rate ? 'text-orange' : 'text-orange/50', 'w-4 sm:h-5 h-4 sm:w-5 flex-shrink-0']" aria-hidden="true" />
    </div>
</template>