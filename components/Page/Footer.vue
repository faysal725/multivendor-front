<script setup>
const route = useRoute();
const { copyRightText } = useRuntimeConfig().public;
</script>

<template>
  <footer class="pb-10 sm:pb-0 w-full mx-auto">
    <div class="px-4 sm:px-8 bg-[#111827]">
      <section
        v-if="route.name === 'index'"
        class="border-b border-dark-border flex flex-wrap items-center py-5"
      >
        <!-- <img class="w-10 sm:w-16" src="@/assets/logo.png" alt=""> -->
        <div>
          <NuxtLink to="/" class="flex items-center sm:gap-1">
            <img class="w-10 sm:w-16" src="@/assets/logo.png" alt="" />

            <p class="text-sm sm:text-xl font-medium text-white sm:mt-4">
              Shopelo
            </p>
          </NuxtLink>
          <p class="text-sm text-white mt-2 leading-6 font-normal">
            Paharika housing society, <br />
            P.O: Modonhat, Fatehpur, <br />
            Hathajari, Chattogram
          </p>
        </div>

        <ul
          class="ml-auto py-2 sm:py-12 flex flex-wrap gap-5 text-sm sm:text-lg text-gray font-thin"
        >
          <li>
            <a href="https://merchant.shopelo.com.bd/"> Merchant Login</a>
          </li>
          <li>
            <nuxt-link to="/legals/terms-&-conditions">
              Terms & Conditions</nuxt-link
            >
          </li>
          <li>
            <nuxt-link to="/legals/return-refund-policy	">
              Return and Refund Policy</nuxt-link
            >
          </li>
          <li>
            <nuxt-link to="/legals/privacy-&-policy"> Privacy Policy</nuxt-link>
          </li>

          <li>
            <nuxt-link to="/legals/about-us"> About Us</nuxt-link>
          </li>
        </ul>
      </section>

      <section
        class="flex sm:flex-nowrap gap-5 justify-between items-start sm:items-center py-2"
        :class="route.name !== 'index' ? '' : 'py-8'"
      >
        <ul class="flex flex-wrap w-full sm:w-auto gap-6">
          <li v-if="route.name === 'index'">
            <a href="#" class="flex items-center gap-3 sm:w-[250px]">
              <p class="text-sm sm:text-base text-gray font-medium">User App</p>
              <img
                class="h-8 sm:h-11"
                src="../../assets/images/FooterImage/Badge.png"
                alt=""
              />
            </a>
          </li>

          <li v-if="route.name === 'index'">
            <a href="#" class="flex items-center gap-3 sm:w-[260px]">
              <p class="text-sm sm:text-base text-gray font-medium">
                Merchant App
              </p>
              <img
                class="h-8 sm:h-11"
                src="../../assets/images/FooterImage/Badge.png"
                alt=""
              />
            </a>
          </li>

          <li v-if="route.name === 'index'">
            <a href="#" class="flex items-center gap-3 sm:w-[250px]">
              <p class="text-sm sm:text-base text-gray font-medium">
                Delivery App
              </p>
              <img
                class="h-8 sm:h-11"
                src="../../assets/images/FooterImage/Badge.png"
                alt=""
              />
            </a>
          </li>

          <li v-if="route.name !== 'index'" class="w-full">
            <p
              class="text-sm text-secondary-col text-start sm:text-center py-2 sm:py-4"
            >
              Copyright @shopelo.com
            </p>
          </li>
        </ul>

        <ul
          class="flex items-center justify-end sm:w-full md:w-[100px] sm:pb-6 gap-6"
        >
          <li class="w-full">
            <a href="https://www.facebook.com/">
              <SvgComponentFacebookIcon
                :height="7"
                :width="7"
                :color="'fill-[#1877F2]'"
              />
            </a>
          </li>
          <li class="w-full">
            <a href="https://www.youtube.com/">
              <SvgComponentYoutubeIcon
                :height="12"
                :width="12"
                :color="'fill-[#FF0000]'"
              />
            </a>
          </li>
        </ul>
      </section>
      <div class="w-full pb-10">
        <img
          src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-03.png"
          class="w-full"
        />
      </div>

      <!-- <div class="w-full pb-10 rounded-xl overflow-hidden">
        <img
          src="../../assets/images/footer/footer-banner.jpeg"
          class="w-1/2"
        />
      </div> -->
    </div>

    <!-- copyright -->
    <div
      v-if="route.name === 'index'"
      class="bg-[#e5e7eb] py-4 mb-1 sm:mb-0 text-xs px-4 sm:px-8 grid grid-cols-2 sm:grid-cols-3 gap-5"
    >
      <p>©{{ new Date().getFullYear() }} {{ copyRightText }}</p>

      <a href="#top" class="underline cursor-pointer text-end sm:text-center"
        >Back to top</a
      >

      <p class="text-end col-span-2 sm:col-span-1">
        This site is developed and maintained by DigiMount Ltd.
      </p>
    </div>
  </footer>
</template>
