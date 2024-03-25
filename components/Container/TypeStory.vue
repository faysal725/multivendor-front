<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';

const videoModal = ref(false)
</script>
<template>
    <main class="px-3 sm:px-8 flex flex-col items-center max-w-full mx-auto">
        <section class="grid lg:grid-cols-12 w-full gap-7 lg:gap-20">
            <div class="lg:col-span-5 typeStory bg-no-repeat bg-cover bg-center py-20 sm:py-36 flex justify-center">
                <button @click="videoModal=!videoModal" class="w-20 sm:w-24 h-20 sm:h-24 bg-primary-col flex justify-center items-center rounded-full">
                    <img src="../../assets/icons/pauseIcon.svg" alt="">
                </button>
            </div>

            <div class="lg:col-span-7 flex flex-col lg:pr-24">
                <p class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 sm:mb-6">Featured Story</p>
                <div class="font-semibold text-base sm:text-xl lg:text-2xl text-black leading-relaxed text-justify">
                    <span>"</span>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Velit necessitatibus odit exercitationem sequi mollitia architecto reiciendis vero quae dicta? Et! Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, est?
                    <span>"</span>
                </div>
                <div class="flex mt-3 items-center text-sm sm:text-base">
                    <p class="font-bold">Ashiqur Rahman</p>
                    <span class="mx-2 font-bold text-primary-col">/</span>
                    <p class="text-sm font-bold text-secondary-col">
                        Dokani, CTG New Market
                    </p>
                </div>
            </div>
        </section>

        <!-- video modal -->
        <div v-if="videoModal" class="fixed inset-0 w-full h-full">
            <div class="h-full w-full py-40 lg:p-40 relative bg-white">
                <button @click="videoModal=false" class="absolute right-1/2 translate-x-1/2 top-24 2xl:top-28 2xl:right-72 text-white p-2 rounded-full bg-primary-col shadow-md group">
                      <XMarkIcon class="w-8 h-8 group-hover:scale-125 transition-all duration-200"/>
                </button>

                <div class="w-full h-full overflow-hidden rounded-xl max-w-7xl mx-auto min-h-[500px]">
                    <iframe class="w-full h-full" 
                       src="https://www.youtube.com/embed/bDJKs6r___g" allow="autoplay=1&rel=0;">
                    </iframe>
                </div>
            </div>
        </div>
    </main>
</template>