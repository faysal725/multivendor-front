<script setup>
const route = useRoute();
const slug = route.params.slug;
</script>

<template>
  <div class="pt-24">
    <div class="h-[98vh] w-full flex justify-center items-start">
      <div class="w-fit flex flex-col justify-center items-center">
        <img
          src="~~/assets/images/PaymentSuccess/success-animation.gif"
          class="h-60"
        />
        <div class="flex flex-col items-center gap-5 justify-center">
          <p class="text-3xl text-center">Payment is done</p>

          <p class="text-5xl text-warningRed">successfully!!!</p>
          <a
            class="bg-primary-col hover:text-primary-col transition-all duration-150 border border-primary-col hover:bg-white text-white p-2 rounded-md"
            :href="'/dashboard/orders/' + slug"
          >
            Track your order now
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
