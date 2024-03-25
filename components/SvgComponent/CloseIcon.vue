<script setup>
const props = defineProps({
  stroke: {
    type: Number,
    required: false
  },
  height: {
    type: Number,
    required: true
  },
  width: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true 
  },
  hoverColor: {
    type: String,
    required: false 
  }
});
</script>
<template>
    <svg
        :class="[
            'w-'+width, 
            'h-'+height,
            ` ${color ? color : 'stroke-lime-300'}`,
            `${!hoverColor ? 'hover:stroke-white': 'hover:'+hoverColor}`
        ]" 
        class="cursor-pointer text-white"
        fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
</template>

