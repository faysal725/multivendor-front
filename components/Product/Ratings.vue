<script setup>
import { useAuthStore } from "~~/stores/authStore";
import { StarIcon } from "@heroicons/vue/20/solid";
import { useCrud } from "~~/composables/useCrud";
import { hyphenRemover } from "~~/composables/utils";

const props = defineProps({
  rating: Number,
  totalReview: Number,
  productData: Object,
});

const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();

const authStore = useAuthStore();

const reviews = {
  average: 4,
  totalCount: 1624,
  counts: [
    { rating: 5, count: 1019, comment: "Excellent" },
    { rating: 4, count: 162, comment: "Good" },
    { rating: 3, count: 97, comment: "Average" },
    { rating: 2, count: 199, comment: "Bad" },
    { rating: 1, count: 147, comment: "Worst" },
  ],
};

const form = ref({
  review: null,
});

let shouldWriteReview = ref(false);
let loading = ref(false);
let rating = ref(1);

const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/products/" + slug + "/reviews";

const submit = async () => {
  loading.value = true;
  await crud
    .store({
      body: {
        star: rating.value,
        comment: form.value.review,
      },
      path: path,
    })
    .then((res) => {
      loading.value = false;
      if (res.status == 200) {
        alert("review is done succefully");
      }
    });
};

// onMounted(async()=>{
//   await crud.get({path:path}).then((res)=>{

//       if (res.status === 200) {
//         allReviews.value = res.res
//         console.log(allReviews.value)
//       }
//     });
// })
</script>

<template>
  <div>
    <h2 class="text-lg tracking-tight font-medium dark:text-gray-100">
      Review of {{ productData.name }}
    </h2>

    <!-- <div class="mt-3 flex items-start flex-col gap-2">
      <div>
        <div class="flex items-center">
          <p class="text-4xl mr- dark:text-gray-200 mr-1">4.0</p>
          <StarIcon
            v-for="rating in [0, 1, 2, 3, 4]"
            :key="rating"
            :class="[
              reviews.average > rating ? 'text-orange' : 'text-orange/50',
              'h-5 w-5 flex-shrink-0',
            ]"
            aria-hidden="true"
          />
        </div>
      </div>
    </div> -->

    <div class="mt-6">
      <h3 class="sr-only dark:text-gray-100">Review data</h3>

      <dl class="space-y-3">
        <div
          v-for="count in reviews.counts"
          :key="count.rating"
          class="flex items-center text-sm"
        >
          <dt class="flex flex-1 items-center">
            <p class="w-16 dark:text-gray-100 text-secondary-col/80">
              {{ count.comment }}<span class="sr-only"> star reviews</span>
            </p>
            <div aria-hidden="true" class="ml-1 flex flex-1 items-center">
              <StarIcon
                v-for="count in count.rating"
                :key="rating"
                class="text-orange h-5 w-5 flex-shrink-0"
                aria-hidden="true"
              />
              <!-- <div class="relative ml-3 flex-1">
                <div class="h-2 rounded-full border border-white bg-white" />
                <div
                  v-if="count.count > 0"
                  class="absolute inset-y-0 rounded-full border border-green bg-green"
                  :style="{
                    width: `calc(${count.count} / ${reviews.totalCount} * 100%)`,
                  }"
                />
              </div> -->
            </div>
          </dt>
        </div>
      </dl>

      <!-- <ButtonSecondary
        v-if="authStore.auth.authenticated"
        @click="shouldWriteReview = !shouldWriteReview"
        :name="'Write a review'"
        class="dark:text-gray-100"
      /> -->

      <form
        @submit.prevent="submit"
        action="#"
        method="POST"
        v-if="shouldWriteReview"
        class="my-10"
      >
        <div class="my-8">
          <p class="text-lg font-medium dark:text-gray-100">My Rate</p>

          <div class="flex">
            <StarIcon @click="rating = 1" class="text-orange h-6" />
            <StarIcon
              @click="rating = 2"
              :class="rating >= 2 ? 'text-orange h-6' : 'text-orange/20 h-6'"
            />
            <StarIcon
              @click="rating = 3"
              :class="rating >= 3 ? 'text-orange h-6' : 'text-orange/20 h-6'"
            />
            <StarIcon
              @click="rating = 4"
              :class="rating >= 4 ? 'text-orange h-6' : 'text-orange/20 h-6'"
            />
            <StarIcon
              @click="rating = 5"
              :class="rating >= 5 ? 'text-orange h-6' : 'text-orange/20 h-6'"
            />
          </div>
        </div>
        <div class="flex justify-between">
          <p class="text-black/80 font-medium dark:text-gray-100">Review</p>
          <p class="text-secondary-col text-sm dark:text-gray-100">
            up to 500 words
          </p>
        </div>

        <div>
          <div class="mt-2">
            <textarea
              v-model="form.review"
              rows="4"
              name="comment"
              id="comment"
              class="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 bg-secondary-col/5 ring-inset ring-secondary-col/50 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <ButtonSecondary :name="'Submit Review'" />
      </form>
    </div>
  </div>
</template>
