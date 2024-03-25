<script setup>

const props = defineProps({
    cartData: Object
})

</script>


<template>

            <li class="flex space-x-2 py-6 border-b border-b-secondary-col/25">
              <img :src="props.cartData.imageSrc" :alt="props.cartData.imageAlt" class="h-16 w-16 flex-none rounded-md bg-gray-100 object-cover object-center" />
              <div class="flex-auto">
                <h3 class="text-lg">
                  <a :href="props.cartData.href">{{ props.cartData.name }}</a>
                </h3>
                <p>{{ props.cartData.edition }}</p>
                <p class="flex-none font-medium text-sm text-secondary-col">{{ props.cartData.price }}</p>
              </div>
              <ProductUnit />
            </li>
</template>