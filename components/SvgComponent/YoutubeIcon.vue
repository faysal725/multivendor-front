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
})

</script>
<template>
    <svg width="28" height="28" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
        :class="[
            'w-'+width, 
            'h-'+height,
            ` ${color ? color : 'stroke-lime-300'}`,
            `${!hoverColor ? 'hover:stroke-white': 'hover:'+hoverColor}`
        ]"  d="M17.8989 2.59864C17.69 1.81319 17.072 1.19355 16.2856 0.981189C14.8638 0.600098 9.15906 0.600098 9.15906 0.600098C9.15906 0.600098 3.45725 0.600098 2.03252 0.981189C1.24907 1.19064 0.631007 1.81028 0.419183 2.59864C0.0390625 4.0241 0.0390625 7.0001 0.0390625 7.0001C0.0390625 7.0001 0.0390625 9.9761 0.419183 11.4016C0.628105 12.187 1.24616 12.8066 2.03252 13.019C3.45725 13.4001 9.15906 13.4001 9.15906 13.4001C9.15906 13.4001 14.8638 13.4001 16.2856 13.019C17.0691 12.8096 17.6871 12.1899 17.8989 11.4016C18.2791 9.9761 18.2791 7.0001 18.2791 7.0001C18.2791 7.0001 18.2791 4.0241 17.8989 2.59864Z" fill="#DCDEE0"/>
    <path class="fill-white" d="M7.3368 9.74337L12.0753 7.0001L7.3368 4.25682V9.74337Z" fill="#252525"/>
    </svg>
</template>

