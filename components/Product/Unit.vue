<script setup>
const number = ref(1);
const emit = defineEmits(["update:modelValue"]);

watch(
  () => number,
  () => {
    if (number.value < 1) {
      number.value = 1;
    }
    let emitThis = number.value;
    emit("update:modelValue", number.value);
  },
  { deep: true }
);
</script>

<template>
  <ul class="flex items-center gap-1">
    <li
      class="bg-lightBlack h-7 w-7 text-white rounded-full text-center flex items-center justify-center font-semibold cursor-pointer"
      @click="number--"
    >
      -
    </li>
    <li>
      <input
        class="bg-lightBlack/10 w-10 h-8 rounded text-center"
        type="number"
        v-model="number"
      />
    </li>
    <li
      class="bg-lightBlack h-7 w-7 text-white rounded-full text-center flex items-center justify-center font-semibold cursor-pointer"
      @click="number++"
    >
      +
    </li>
  </ul>
</template>
