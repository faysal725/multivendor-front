


<script setup>
const props = defineProps({
    stroke: {
    type: String,
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
})

</script>
<template>
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
        :class="[
            'w-'+width, 
            'h-'+height,
        ]"  d="M7.71484 2.96503L10.7498 6.00003L7.71484 9.03503" stroke="#115855" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        <path :class="[
            'w-'+width, 
            'h-'+height,
        ]"
        d="M2.25 6H10.665" stroke="#115855" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</template>


<!-- <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.71484 2.96503L10.7498 6.00003L7.71484 9.03503" stroke="#E02E52" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M2.25 6H10.665" stroke="#E02E52" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg> -->