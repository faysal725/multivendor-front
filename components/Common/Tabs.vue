<script setup>
const props = defineProps({
  data: Array
})
let presentTab = ref(0)

const emit = defineEmits(['updateInput'])


watch(
    () => presentTab.value,
    () => {
        emit('updateInput', presentTab.value)
    }
)

</script>



<template>
    <div class="">
        <ul class="flex gap-8 font-semibold text-lg">

            
            <li @click="presentTab = data.id" v-for="data in props.data" :key="data.id" class="py-2 cursor-pointer" :class="presentTab === data.id ? 'border-b-2' : 'border-b-0' " >
                <p :class="presentTab === data.id ? 'text-black' : 'text-secondary-col font-normal' ">{{data.name}}</p>
            </li>
        </ul>


    </div>
</template>