<script setup>
import { PhoneIcon } from "@heroicons/vue/24/solid";
import { drivewayDistance } from "@/composables/utils";

const props = defineProps({
  donor: Object,
});

const distance = ref(0);
onMounted(async () => {
  // console.log(
  //   await drivewayDistance(props.donor.latitude, props.donor.longitude)
  // );
  await drivewayDistance(props.donor.latitude, props.donor.longitude).then(
    (res) => {
      distance.value = res.res;
    }
  );
  // {{ drivewayDistance(donor.latitude, donor.longitude) }}
});
</script>

<template>
  <li
    class="bg-white p-2 border border-primaryText/10 rounded-lg flex gap-2 items-center w-[290px] sm:w-96 h-20"
  >
    <!-- <img class="w-8" src="~/assets/icons/donor2.png" alt="" /> -->
    <div
      class="bg-warningRed h-12 w-12 rounded-full flex justify-center items-center"
    >
      <span class="text-lg text-white">{{ donor.blood_type }}</span>
    </div>
    <div class="relative">
      <div class="flex items-center gap-x-2">
        <p class="font-semibold">{{ donor.user.name }}</p>

        <div class="relative">
          <img class="h-6 w-4" src="../../assets/icons/drop2.png" alt="" />
        </div>
      </div>

      <p class="text-sm p-0 m-0">{{ distance }} km away</p>
      <p class="text-base flex">
        <PhoneIcon class="h-5 ml-auto pr-2 text-darkGray/80" />
        {{ donor.phone }}
      </p>
    </div>

    <a class="h-5 ml-auto" :href="'tel:' + donor.phone">
      <PhoneIcon class="h-5 ml-auto pr-2 text-warningRed"
    /></a>
  </li>
</template>
