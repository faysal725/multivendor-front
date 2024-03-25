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
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path :class="[
            'w-'+width, 
            'h-'+height,
            ` ${color ? color : 'stroke-lime-300'}`,
            `${!hoverColor ? 'hover:stroke-white': 'hover:'+hoverColor}`
            ]" 
        d="M7.66732 14.5C3.90065 14.5 0.833984 11.4334 0.833984 7.66671C0.833984 3.90004 3.90065 0.833374 7.66732 0.833374C11.434 0.833374 14.5007 3.90004 14.5007 7.66671C14.5007 11.4334 11.434 14.5 7.66732 14.5ZM7.66732 1.83337C4.44732 1.83337 1.83398 4.45337 1.83398 7.66671C1.83398 10.88 4.44732 13.5 7.66732 13.5C10.8873 13.5 13.5007 10.88 13.5007 7.66671C13.5007 4.45337 10.8873 1.83337 7.66732 1.83337Z" fill="#4B5563"/>
        <path :class="[
            'w-'+width, 
            'h-'+height,
            ` ${color ? color : 'stroke-lime-300'}`,
            `${!hoverColor ? 'hover:stroke-white': 'hover:'+hoverColor}`
        ]" 
        d="M14.3584 15C14.1953 15 14.0322 14.94 13.9034 14.8113L12.1867 13.0958C11.9378 12.847 11.9378 12.4353 12.1867 12.1866C12.4356 11.9378 12.8476 11.9378 13.0966 12.1866L14.8133 13.9021C15.0622 14.1508 15.0622 14.5625 14.8133 14.8113C14.6845 14.94 14.5215 15 14.3584 15Z" fill="#4B5563"/>
    </svg>
</template>



