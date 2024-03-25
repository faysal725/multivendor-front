<script setup>
const props = defineProps({
data: Object
})
const emit = defineEmits(['update:modelValue'])
onMounted(()=>{
    emitData(props.data.options[0]);
})
const emitData = (option)=>{
    emit('update:modelValue',
        {
            'code':  props.data.id +""+ option.id,
            'string':props.data.name.toString()+": "+option.label.toString()
        }
    )
}
</script>
<template>
        <ul class="flex gap-2">
            <li v-for="option,index in props.data.options" class="flex items-center gap-1 px-2 py-1 text-white rounded"
            :style="{ backgroundColor : option.value }"
            @click="emitData(option)"
            >
                <input type="radio" name="color" :id="'color-'+index" v-if="index== 0" checked >
                <input type="radio" name="color" :id="'color-'+index" v-else >
                <label class="font-medium" :name="'color-'+index" :for="'color-'+index" >{{option.label}}</label>
            </li>
            
        </ul>

        
</template>