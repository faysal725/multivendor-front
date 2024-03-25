<script setup >
import { Tab,TabGroup, TabPanel,TabPanels,
  } from '@headlessui/vue'
  const props = defineProps({
    images: Object
  })
const show = ref(false)
</script>

<template>
    <!-- Image gallery -->
    <TabGroup as="div" class="flex flex-col-reverse">
          <!-- Image selector -->
          <div class="mx-auto w-full max-w-2xl lg:max-w-none">
             <ContainerHorizontal :link="''" >
                <Tab v-for="image in images" :key="image.id" class="relative flex h-14 sm:h-20 w-14 sm:w-20 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none" v-slot="{ selected }">
                <span class="sr-only"> {{ image.name }} </span>
                <span class="absolute inset-0 overflow-hidden rounded-md">
                <img   :src="image" alt="product image" class="h-full w-full object-cover object-center" />
                </span>
                <span :class="[selected ? 'ring-primary-col/50' : 'ring-transparent', 'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2']" aria-hidden="true" />
              </Tab>
              </ContainerHorizontal>
          </div>
          <!-- image selector end -->
         

          <TabPanels class="aspect-w-1 aspect-h-1 w-full">
              <TabPanel v-for="image,index in images" :key="index" class="w-full h-80 sm:h-[500px]">
                  <img @click="show = !show" :src="image" alt="Product Image" class="w-full h-full object-contain object-center sm:rounded-lg" />
              </TabPanel>
          </TabPanels>
          <!-- <ImagePreviewer :preview="show" :images="images" ></ImagePreviewer> -->
    </TabGroup>
    
    
</template>