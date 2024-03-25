<script setup>
const props = defineProps({
  modelValue: [String, Number],
  title: String,
  label: String,
  type: String,
  error: String,
  oldValue: [String, null],
});
let showPass = ref(false);
let errorMsg = ref("");
const previous = "" + props.oldValue;

const emit = defineEmits(["update:modelValue"]);
watch(
  () => props.error,
  () => {
    errorMsg.value = props.error;
  },
  { deep: true }
);
</script>

<template>
  <main
    class="rounded-md px-3 pt-2.5 pb-1.5 w-full shadow-sm ring-1 ring-inset focus-within:ring-1 focus-within:ring-skyBlue group relative"
    :class="errorMsg.length > 0 ? 'ring-red/50' : 'ring-darkGray/50'"
  >
    <label
      :for="label"
      class="block text-xs group-focus-within:text-skyBlue focus-within:ring-skyBlue'"
      :class="errorMsg.length > 0 ? 'text-red/50' : 'text-darkGray/70'"
      >{{ title }}</label
    >

    <!-- <input
      :type="type"
      :name="label"
      :id="label"
      class="block w-full border-0 p-0 text-gray-900 bg-transparent placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6"
      :value="previous"
      @input="$emit('update:modelValue', $event.target.value)"
    /> -->

    <textarea
      rows="4"
      :name="label"
      :id="label"
      class="block w-full rounded-md border-0 text-gray-900 shadow-sm bg-secondary-col/5 placeholder:text-gray-400 sm:py-1.5 sm:text-sm sm:leading-6 px-2"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <span
      class="text-xs font-light text-warningRed absolute left-0 -bottom-5"
      >{{ errorMsg }}</span
    >
  </main>
</template>
