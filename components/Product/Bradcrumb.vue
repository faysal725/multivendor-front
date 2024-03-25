  
<script setup>
const props = defineProps({
    pages: Object
})
</script>

<template>
    <nav class="flex" aria-label="Breadcrumb">
      <ol role="list" class="flex items-center text-secondary-col flex-wrap gap-x-4">
        
        <li v-for="page in props.pages" :key="page.id">
          <div class="relative" >
            <a :href="page.href" class="text-xs sm:text-sm" 
            :class="page.id === 0? 'underline': ''"
            :aria-current="page.current ? 'page' : undefined">{{ page.name }}</a>

            <svg class="h-4 w-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-300 absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>
            
          </div>
        </li>
      </ol>
    </nav>
  </template>
