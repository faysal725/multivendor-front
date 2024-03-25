<script setup>
import { ShareIcon } from "@heroicons/vue/20/solid";

const props = defineProps({
  link: String,
});

const { frontendUrl } = useRuntimeConfig().public;

const shareModal = ref(false);
const productLink = ref(frontendUrl + "/product/" + props.link);

const copyLink = () => {
  navigator.clipboard.writeText(productLink.value);
  alert("Copied");
};
</script>

<template>
  <section>
    <!-- <button>Share</button> -->
    <ShareIcon
      v-if="!shareModal"
      @click="shareModal = true"
      class="h-5 w-5 text-overlay/70 cursor-pointer"
    />

    <ContainerModal v-if="shareModal" v-model="shareModal" :height="'250px'">
      <div class="w-full pb-8">
        <div class="pt-3 pb-5">
          <p class="text-lg font-medium">Share this link</p>
        </div>
        <div class="relative rounded-lg overflow-hidden">
          <label for="productLink" />
          <input
            type="text"
            id="productLink"
            class="border border-black/70 rounded-lg p-3 w-full"
            :value="productLink"
          />
          <button
            @click="copyLink"
            class="absolute right-0 bg-primary-col px-7 text-white p-3 h-full"
          >
            Copy
          </button>
        </div>
      </div>
    </ContainerModal>
  </section>
</template>
