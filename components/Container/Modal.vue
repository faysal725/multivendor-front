<script setup>
import {
  UserCircleIcon,
  TruckIcon,
  MapPinIcon,
  PrinterIcon,
  ArrowPathIcon,
  StarIcon,
  DocumentIcon,
  XMarkIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps({
  height: String,
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div
    v-if="productToReview != ''"
    class="fixed flex justify-center items-center w-full h-full bg-black/40 z-30 top-0 left-0"
  >
    <div
      class="bg-white sm:w-[400px] lg:w-[600px] min-w-[350px] rounded-lg p-1"
      :class="height ? `min-h-[${height}] ` : ' min-h-[350px] '"
    >
      <div
        class="w-full h-full rounded-lg relative p-3"
        :class="height ? `min-h-[${height}] ` : ' min-h-[350px] '"
      >
        <div
          class="absolute top-2 right-2"
          @click="$emit('update:modelValue', false)"
        >
          <XMarkIcon
            class="h-7 w-7 text-warningRed cursor-pointer transition-all duration-100 hover:scale-110"
          />
        </div>

        <div
          class="flex flex-col justify-center items-center w-full h-full gap-10 px-5"
          :class="height ? `min-h-[${height}] ` : ' min-h-[350px] '"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
