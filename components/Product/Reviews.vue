<script setup>
import { StarIcon } from "@heroicons/vue/20/solid";
import { useCrud } from "~~/composables/useCrud";

const props = defineProps({
  product: Object,
});

const route = useRoute();
const slug = route.params.slug;
const crud = useCrud();

const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/products/" + slug + "/reviews";
let loading = ref(false);

let allReviews = ref([]);

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
  featured: [
    {
      id: 0,
      rating: 5,
      content: `
        <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
      `,
      author: "Emily Selman",
      avatarSrc:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },

    {
      id: 1,
      rating: 5,
      content: `
        <p>This is the bag of my dreams. I took it on my last vacation and was able to fit an absurd amount of snacks for the many long and hungry flights.</p>
      `,
      author: "Emily Selman",
      avatarSrc:
        "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80",
    },
  ],
};

const reviewLoad = async () => {
  await crud.get({ path: path }).then((res) => {
    if (res.status === 200) {
      allReviews.value = res.res.length ? res.res : [];
      loading.value = true;
    }
  });
};
onMounted(() => {
  reviewLoad();
});
</script>

<template>
  <div class="bg-white">
    <div
      class="mx-auto max-w-2xl py-16 bg-gray sm:px-6 grid grid-cols-1 lg:max-w-full lg:grid-cols-12 lg:gap-x-8 lg:px-8"
    >
      <!-- review mark section  -->

      <div class="lg:col-span-4">
        <ProductRatings
          :rating="Math.floor(props.product.review)"
          :totalReview="allReviews.length"
          :productData="product"
        />
      </div>

      <!-- reviews -->
      <div
        v-if="props.product.review"
        class="mt-16 border-l border-l-secondary-col/40 pl-5 lg:col-span-7 lg:col-start-6 lg:mt-0"
      >
        <h3 class="sr-only">Recent reviews</h3>

        <div class="flow-root">
          <p class="font-medium text-lg">Customers Rating</p>
          <div v-if="loading" class="relative mb-5">
            <CommonCardsReview
              v-if="allReviews.length > 0"
              v-for="review in allReviews"
              :key="review.id"
              :reviewData="review"
            />

            <!-- <button
              @click="reviewLoad"
              class="border-2 px-4 p-2 rounded-full text-sm absolute -bottom-16 sm:right-52 hover:bg-black hover:text-white w-full sm:w-auto"
            >
              See all review
            </button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
