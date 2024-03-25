<script setup>
import {
  StarIcon,
  ShoppingCartIcon,
  Bars3BottomLeftIcon,
  HeartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/20/solid";
const props = defineProps({
  primary: Boolean,
});

const route = useRoute();
const slug = route.params.slug;

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

let searchedValue;
const key = ref(12);

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
</script>

<template>
  <div class="relative w-full h-full">
    <div
      class="bg-white sm:rounded-md rounded-xl relative w-full flex items-center h-10 sm:h-12"
    >
      <select
        v-model="selectedSearchType"
        class="w-auto h-full px-3 rounded-md hidden sm:block"
        name="url"
      >
        <option v-for="dt in data">{{ dt.field }}</option>
      </select>

      <div class="relative w-full h-full">
        <input
          v-model="searchData.searchText"
          type="text"
          class="bg-transparent pl-4 pr-3 py-1 sm:py-2 h-full focus:outline-none w-full"
          autocomplete="additional-name"
          placeholder="Search...."
        />

        <button
          @click="goToSearch"
          class="absolute right-0 top-0 text-primary-col bg-white font-semibold rounded-xl px-2 h-full"
        >
          <MagnifyingGlassIcon class="w-6 h-6" />
        </button>

        <div
          class="hidden absolute top-full left-0 w-[88%] bg-white overflow-hidden rounded-md shadow-md z-30 mt-0.5"
        >
          <ul>
            <li v-for="n in data">
              <nuxt-link
                to="#"
                class="px-6 py-2 text-base font-medium block hover:text-primary-col hover:bg-[#f3f4f6] transition-all duration-200"
                >{{ n.items }}</nuxt-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
