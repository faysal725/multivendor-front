<script setup>
// function scrollEnd(e){

// }

</script>

<template>
<main class="grid grid-cols-12 min-h-screen	">
    <!-- <PageNavbar/>
    <slot/>
    <PageFooter/> -->


    <section class="col-span-12">
        <PageNavbar />
    </section>


    <!-- body  -->
    <section class="col-span-12">
        <section class="">
            <slot />
        </section>
    </section>

    <!-- footer  -->
    <section class="col-span-12">
        <PageFooter />
    </section>
    <!-- <Toast /> -->
</main>
</template>




