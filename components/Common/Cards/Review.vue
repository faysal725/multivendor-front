<script setup>
import { StarIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  reviewData: Object,
});

// console.log(props.reviewData)
const { id, star, comment, user_id, created_at, user } = props.reviewData;
</script>

<template>
  <div class="flex items-center">
    <div>
      <div class="flex items-center my-4">
        <div class="flex flex-col gap-2 w-full">
          <div class="mt-1 flex items-center">
            <p class="mr-1 pt-1">{{ star + ".0" }} -</p>
            <StarIcon
              v-for="rating in [1, 2, 3, 4, 5]"
              :key="rating"
              :class="[
                star >= rating ? 'text-orange' : 'text-orange/50',
                'h-5 w-5 flex-shrink-0',
              ]"
              aria-hidden="true"
            />
          </div>
          <h4 class="text-sm">by {{ user.name }}</h4>
          <p class="sr-only">{{ star }} out of 5 stars</p>
        </div>
      </div>

      <div
        class="mt-4 space-y-6 text-base text-secondary-col text-gray-600"
        v-html="comment"
      />
    </div>
    <div class="ml-auto text-secondary-col text-sm">
      <p>
        {{ IsoToLocal(created_at).localDateString }}
      </p>
      <p>
        {{ IsoToLocal(created_at).localTimeString }}
      </p>
    </div>
  </div>
</template>
