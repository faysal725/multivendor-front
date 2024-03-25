<script setup>
</script>

<template>
    <div>
        <!-- <div class="z-[2000] fixed bg-mediumGray w-full flex gap-5"> 
            <NuxtLink to="/merchant/login" class="pointer" >merchant login</NuxtLink>
            <NuxtLink to="/merchant/signup" class="pointer" >merchant signup</NuxtLink>

            
        </div>  -->
        <PageMerchantNavbar />
            <div class="grid grid-cols-12 pt-40 px-7 min-h-[94vh]">
                <div class="bg-secondary-col col-span-2">
                    sdfsdf
                </div>

                <div class="bg-secondary-col/50 col-span-10">
                    asdf
                </div>
                <!-- <slot/> -->
            </div>

            <!-- <div class="bg-secondary-col col-span-3">
                    sdf
                </div>

                <div class="bg-secondary-col/50 col-span-7">
                    <slot/>
                </div> -->

        <PageFooter/>
    </div>
</template>