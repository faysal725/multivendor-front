<script setup>
import { onMounted, ref } from 'vue';

defineProps({
    modelValue: String,
});

defineEmits(['update:modelValue']);

// const input = ref(null);

// onMounted(() => {
//     if (input.value.hasAttribute('autofocus')) {
//         input.value.focus();
//     }
// });

// defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        ref="input"
        class="h-8 w-full p-2 block text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    >
</template>