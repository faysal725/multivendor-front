<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
    label: String,
})


const route = useRoute()
const slug = route.params.slug;
const focusInput = ref(null);

const emit = defineEmits(['updateInput'])

let searchInput = ref('')


onMounted(()=>{
   searchInput.value = slug
   setTimeout(() => {
    focusInput.value.focus();
    }, 1000);
})

watch(
    () => searchInput.value,
    () => {
        emit('updateInput', searchInput.value)
    }
)

// const timer = setTimeout(() => {
//     filter.value.focus();
// }, 5000);


</script>

<template>
    <div class="flex flex-col items-center justify-center w-full md:w-1/2 lg:w-2/5 relative">
        <label :for="label"></label>

        <!-- id="searchBox" -->
        <input 
        class="text-sm p-4 pr-12 bg-gray border border-[#d1d5db] py-3 rounded-md focus:outline-none focus:border-primary-col w-full"
        type="text" 
        v-model="searchInput" 
        placeholder="Search .."
        ref="focusInput"
        style="box-shadow: 0 3px 7px #7f7f7f29;"
        >
        <button class="absolute top-0 right-0 h-full px-3">
            <MagnifyingGlassIcon class="w-6 h-6"/>
        </button>
    </div>

</template>