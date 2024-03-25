<script setup>
const props = defineProps({
  data: Array
})
const {hrefLandingMerchant} = useRuntimeConfig().public;
const {hrefLandingRider} = useRuntimeConfig().public;
const {hrefLandingDoner} = useRuntimeConfig().public;

</script>

<template>
    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between px-3 sm:px-24 max-w-full mx-auto">
        <section class="flex flex-col justify-between pb-4 rounded-md cursor-pointer border border-transparent hover:border-light-border">
            <div class="flex justify-center"> 
                <img class="w-full sm:w-60 h-full sm:h-60 my-3" src="../../assets/images/containerImg/shop.jpeg" alt="">
            </div>
            <div class="flex flex-col justify-center px-0 lg:px-16">

                <p class="font-medium text-black text-center">Become A Merchant</p>
                <p class="text-sm text-secondary-col text-center">Grow you business and reach your nearby customers</p>
                <a href="https://merchant.shopelo.com.bd/" class="text-sm font-medium text-primary-col mt-2 flex justify-center items-center gap-1 hover:-translate-x-1 transition-all duration-200 group">
                    Merchant Login
                    <SvgComponentArrowRightIcon
                        
                        :height="6" 
                        :width="6" 
                        :color="'fill-primary'" 
                        class="group-hover:translate-x-2 transition-all duration-200"
                        />
                </a>
            </div>
        </section>
   
        <section class="flex flex-col justify-between pb-4 rounded-md cursor-pointer border border-transparent hover:border-light-border">
            <div class="flex justify-center">
                <img class="w-full sm:w-60 h-full sm:h-60 my-3" src="../../assets/images/containerImg/bike.jpeg" alt="">
            </div>
            <div class="flex flex-col justify-center px-0 lg:px-16">

                <p class="font-medium text-black text-center">Become A Rider</p>
                <p class="text-sm text-secondary-col text-center">Be a delivery boy to build your delivery career</p>
                <a href="#" class="text-sm font-medium text-primary-col mt-2 flex justify-center items-center gap-1 hover:-translate-x-1 transition-all duration-200 group">
                    Download Rider app
                    <!-- <img src="../../assets/icons/arrow-right.svg" alt=""> -->
                    <SvgComponentArrowRightIcon
                        
                        :height="6" 
                        :width="6" 
                        :color="'fill-primary'"
                        class="group-hover:translate-x-2 transition-all duration-200" 
                        />
                </a>
            </div>
        </section>

        <section class="flex flex-col justify-between pb-4 rounded-md cursor-pointer border border-transparent hover:border-light-border">
            <div class="flex justify-center">
                <img class="w-full sm:w-60 h-full sm:h-60 my-3" src="../../assets/images/containerImg/blood.jpeg" alt="">
            </div>
            <div class="flex flex-col justify-center px-0 lg:px-16">

                <p class="font-medium text-black text-center">Help sick people donate blood</p>
                <p class="text-sm text-secondary-col text-center">Help people donating blood.</p>
                <nuxt-link to="/blood-donation" class="text-sm font-medium text-primary-col mt-2 flex justify-center items-center gap-1 hover:-translate-x-1 transition-all duration-200 group">
                    Request For Blood
                    <!-- <img src="../../assets/icons/arrow-right.svg" alt=""> -->
                    <SvgComponentArrowRightIcon
                        
                        :height="6" 
                        :width="6" 
                        :color="'fill-primary'" 
                        class="group-hover:translate-x-2 transition-all duration-200"
                        />
                </nuxt-link>
            </div>
        </section>
        
    </main>
</template>