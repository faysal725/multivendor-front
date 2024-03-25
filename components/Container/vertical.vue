<script setup>
import { getFirstWordInSlash } from '../../composables/utils'
const props = defineProps({
    title: String,
    items: String
})
const route = useRoute()

let firstParams = getFirstWordInSlash(route.fullPath)


</script>

<template>
    <div class="relative ">
        <p class="text-2xl font-semibold">{{ title }}</p>
        
        <ul 
        class="grid "
        :class="props.items === 'gallary' ? 'grid-cols-1 gap-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12 xl:grid-cols-12': 'grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' "
        >
            
            <slot />
        </ul>
    </div>
</template>



