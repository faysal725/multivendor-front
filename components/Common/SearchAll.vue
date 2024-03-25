<script setup lang="ts">
import { Typed } from "@duskmoon/vue3-typed-js";
const props = defineProps({
  primary: Boolean,
});

const selectedSearchType = ref("Product");
const data = [
  {
    field: "Product",
  },
  {
    field: "Shop",
  },
  {
    field: "Mall",
  },
];

const searchData = ref({
  field: "",
  searchText: "",
});

// watch(
// () => searchData.value.searchText,
// () => {

//    if (searchData.value.searchText.length >= 0) {

//
//       navigateTo('/search/'+searchData.value.searchText)
//    }
//    }
// )

const goToSearch = () => {
  //   navigateTo("/search/" + searchData.value.searchText);
  if (searchData.value.searchText !== "") {
    console.log(searchData.value.searchText, selectedSearchType.value);
    if (selectedSearchType.value == "Shop") {
      navigateTo("/search/shop/" + searchData.value.searchText);
    } else if (selectedSearchType.value == "Mall") {
      navigateTo("/search/shopping-malls/" + searchData.value.searchText);
    } else {
      navigateTo("/search/" + searchData.value.searchText);
    }
  } else {
    Return;
  }
};

const options = {
  strings: ["Search in Product"],
  loop: true,
  typeSpeed: 150,
};
let showInput = ref(true);

const enterPress = () => {};
</script>

<template>
  <div class="relative w-full h-full">
    <div class="bg-white rounded-md relative w-full flex items-center h-12">
      <select
        v-model="selectedSearchType"
        class="w-auto h-full px-3 rounded-md"
        name="url"
      >
        <option v-for="dt in data">{{ dt.field }}</option>
      </select>

      <div class="relative w-full h-full">
        <form @submit.prevent="enterPress" class="h-full">
          <Typed
            v-if="showInput"
            @click="showInput = false"
            :options="options"
            class="h-full"
          >
            <input
              type="text"
              v-model="searchData.searchText"
              class="typing bg-transparent pl-4 pr-28 py-2 h-full focus:outline-none w-full"
              autocomplete="additional-name"
              placeholder="Search"
            />
          </Typed>

          <input
            v-else
            type="text"
            v-model="searchData.searchText"
            class="typing bg-transparent pl-4 pr-28 py-2 h-full focus:outline-none w-full"
            autocomplete="additional-name"
            placeholder="Search"
          />

          <button
            type="submit"
            class="absolute right-0.5 top-1/2 -translate-y-1/2 bg-primary-col text-white font-semibold rounded-md px-6 py-2.5"
            @click="goToSearch()"
          >
            Search
          </button>
        </form>
        <div
          class="hidden absolute top-full left-0 w-[88%] bg-white overflow-hidden rounded-md shadow-md z-10 mt-0.5"
        >
          <ul>
            <li v-for="n in data">
              <nuxt-link
                to="#"
                class="px-6 py-2 text-base font-medium block hover:text-primary-col hover:bg-[#f3f4f6] transition-all duration-200"
                >{{ n.field }}</nuxt-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
