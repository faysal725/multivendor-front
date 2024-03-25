<script setup>
const {hrefLandingDoner} = useRuntimeConfig().public;

</script>


<template>
    <main class=" grid lg:grid-cols-12 px-3 sm:px-8 gap-10 lg:gap-0 max-w-full mx-auto">

        <section class="type3Img bg-no-repeat bg-cover bg-center py-24 sm:py-48 lg:col-span-7"></section>

        <section class="lg:pt-5 lg:p-10 pr-0 lg:col-span-5">
            <p class="text-2xl sm:text-3xl md:text-4xl font-semibold">Save life register your blood group</p>
            <p class="text-secondary-col my-2 mb-8 text-sm sm:text-base">Help people giving your blood. You can also collect <br> emergency blood donation.</p>

            <NuxtLink to="/blood-donation" class="bg-primary-col hover:bg-white border-2 border-primary-col text-white hover:text-primary-col font-semibold rounded-full p-1 px-6 py-2">Become a doner</NuxtLink>
        </section>
    </main>
</template>