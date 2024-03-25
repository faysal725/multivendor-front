<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  path: String,
  paginationData: Object,
});
const { from, last_page, path, current_page } = props.paginationData;
const emit = defineEmits(["updateInput"]);

const currentPage = ref(current_page);
const firstPage = from;
const lastPage = last_page;
const totalPage = lastPage;

function pageChanger(page) {
  currentPage.value = page;
  let api = path + "?page=" + page;
  emit("updateInput", page);
}

function onePageAhead() {
  currentPage.value = currentPage.value + 1;
  let api = path + "?page=" + currentPage.value;
  emit("updateInput", currentPage);
}

function onePageBefore() {
  currentPage.value = currentPage.value - 1;
  let api = path + "?page=" + currentPage.value;
  emit("updateInput", currentPage);
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="#"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Previous</a
      >
      <a
        href="#"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >Next</a
      >
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-center">
      <div>
        <nav
          class="isolate inline-flex -space-x-px gap-1 rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <a
            href="#"
            @click="onePageBefore"
            v-if="currentPage !== firstPage"
            class="relative hover:bg-blue/80 hover:text-white inline-flex items-center rounded-l-md px-2 py-2 text-xs text-secondary-col"
          >
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
            <span>Prev</span>
          </a>

          <a
            v-for="page in totalPage"
            :key="currentPage"
            href="#"
            aria-current="page"
            class="relative cursor-pointer z-10 inline-flex items-center px-4 py-2 text-sm font-semibold text-white border"
            :class="page === currentPage ? 'bg-blue/80' : 'bg-darkGray/20'"
            @click="pageChanger(page)"
            >{{ page }}</a
          >

          <a
            href="#"
            @click="onePageAhead"
            v-if="currentPage !== totalPage"
            class="relative hover:bg-blue/80 hover:text-white cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-xs text-secondary-col"
          >
            <span>Next</span>
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
