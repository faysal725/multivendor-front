<script setup>
const { hrefLandingKachaBazarGrocery } = useRuntimeConfig().public;
</script>

<template>
  <main class="bg-white">
    <div
      class="grid lg:grid-cols-12 px-3 sm:px-8 gap-4 lg:gap-0 max-w-full mx-auto"
    >
      <section class="lg:col-span-5">
        <div class="sm:pr-5 py-5 h-full">
          <p class="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Get sobji delivery from your nearest bazar within one hour
          </p>
          <p class="text-secondary-col mb-8 text-sm sm:text-base">
            Find your nearby shops and get you order from home safe & secure
          </p>

          <NuxtLink
            to="/grocery"
            class="bg-primary-col hover:bg-white border-2 border-primary-col text-white hover:text-primary-col font-semibold rounded-full p-1 px-6 py-2"
            >Get Kacha Bazar</NuxtLink
          >
        </div>
      </section>
      <section
        class="type2Img bg-no-repeat bg-cover bg-center py-24 sm:py-48 lg:col-span-7 order-first lg:order-last"
      ></section>
    </div>
  </main>
</template>
