<script setup>
import { useCrud } from "~~/composables/useCrud";

const { apiVersion, isNearest, appName, appDescription } =
  useRuntimeConfig().public;

const route = useRoute();
const crud = useCrud();
const slug = route.params.slug;

const path = apiVersion + "/utility/" + slug;

let loaded = ref(false);
let privacyPolicy = ref("");
const dataLoad = async () => {
  await crud.get({ path: path }).then((res) => {
    // console.log(res.res.details);
    privacyPolicy.value = res.res.details;
    loaded.value = true;
  });
};

onMounted(() => {
  dataLoad();
});
</script>

<template>
  <div class="px-4 sm:px-8 lg:px-20 pt-32">
    <p class="text-2xl sm:text-3xl xl:text-5xl mb-5 uppercase">{{ slug }}</p>
    <div v-if="loaded">
      <CommonDescriptionStyler :text="privacyPolicy" />
    </div>
    <div v-else></div>
  </div>
</template>
