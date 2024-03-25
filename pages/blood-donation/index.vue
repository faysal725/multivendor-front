<script setup>
 import { PlayIcon } from '@heroicons/vue/24/solid';
</script>

<template>
  <section
    class="flex flex-col justify-around max-w-full mx-auto pt-[85px] min-h-screen"
  >
    <div
      class="bg-[url('~~/assets/images/donor/donor2.jpg')] h-[550px] bg-no-repeat bg-top bg-cover flex items-center mb-8"
    >
      <div class="pl-10 lg:pl-28 flex flex-col gap-5">
        <p class="text-3xl text-white font-thin">Donate blood, save life!</p>
        <p class="pt-2 text-6xl font-extrabold uppercase text-white">
          Your Blood <br />
          Can Bring smile <br />
          in other person face
        </p>
        <div class="flex gap-3 text-2xl">
          <NuxtLink
            to="/dashboard/donate-blood"
            class="bg-warningRed p-3 hover:bg-overlay transition-all duration-100 text-white"
          >
            Register as a Donor
          </NuxtLink>
          <NuxtLink
            to="/blood-donation/find-blood"
            class="bg-overlay/70 p-3 hover:bg-overlay transition-all duration-100 text-white"
          >
            Find Donor
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="px-20 pb-10">
      <div class="grid grid-cols-2 gap-8 pb-8">
        <div class="col-span-2 lg:col-span-1 bg-[#F9FAFB] p-10 translate-y-14 relative">
          <div class="flex flex-col gap-3 relative z-10">
            <div>
              <p class="text-5xl font-semibold text-overlay/70">Who We Are?</p>
              <div class="bg-warningRed h-0.5 w-20"></div>
            </div>
            <p>
              Shopelo is for public donation center with blood donation members
              in the changing health care system.
            </p>
            <ul class="list-disc pl-4 leading-8">
              <li>Specialist blood donors and clinical supervision.</li>
              <li>Increasing communication with our members.</li>
              <li>High quality assessment, diagnosis and treatment.</li>
              <li>Examine critically to ensure alignment.</li>
              <li>The extra care of a multi-disciplinary team.</li>
            </ul>
          </div>
          <div class="bg-[#F9FAFB] w-full h-full absolute top-0 -right-24"></div>
        </div>
        <div class="col-span-2 lg:col-span-1">
          <div
            class="bg-[url('~~/assets/images/donor/about_feat_bg.jpg')] h-80 lg:h-full flex items-center justify-center bg-no-repeat bg-top bg-cover relative"
          >
           <div class="p-1 rounded-full bg-white inline-block">
              <button class=" bg-primary-col/70 flex items-center justify-center text-warningRed w-20 h-20 rounded-full">
                 <PlayIcon class="w-8 h-8" />
              </button>
           </div>
        </div>
        </div>
      </div>
    </div>

    <div class="bg-[#EDEDED] pb-5">
      <div class="h-[600px] pt-32 bg-center bg-no-repeat bg-cover text-center bg-[url('~~/assets/images/donor/testimony_feat_bg.jpg')]">
        <p class="text-white font-medium text-2xl mb-6">Awesome Words From Members</p>
        <h3 class="text-white font-bold text-5xl">JOIN WITH US AND SAVE LIFE</h3>
      </div>
      <div class="px-40 max-h-[350px]">
         <div class="grid grid-cols-2 bg-white h-full -translate-y-60">
          <div class="py-20 px-10">
            <div>
                <h4 class="text-3xl font-semibold text-red mb-8">Donor Opinion</h4>
                <p class="text-lg font-medium leading-8">
                    I wish I could tell you my donor how grateful I am for your selfless act.You gave me new life. We may be coworkers or schoolmates or just two in the same community.I'm very grateful to you.  
                </p>

                <div class="pt-6">
                   <div class="w-16 h-w-16 rounded-full overflow-hidden"><img src="../../assets/images/donor/user_1.jpg" class="w-full h-full flex-shrink-0" alt=""></div>
                   <h6 class="text-xl font-normal mt-5 mb-3">Brandon Munson</h6>
                   <span class="text-base">CTO, Fulcrum Design, USA</span>
                </div>
            </div>
          </div>
          <div class="h-[500px] bg-cover bg-top bg-no-repeat bg-[url('~~/assets/images/donor/testimony_feat_img.jpg')]"></div>
         </div>
      </div>
    </div>

    <div>
      <div class="h-[500px] pt-32 bg-center bg-no-repeat bg-cover text-center bg-[url('~~/assets/images/donor/appointment_female_bg.jpg')]"></div>

      <div class="px-20 py-10">
         <div>
            <p class="text-xl mb-4">Good To Know</p>
            <h5 class="text-4xl font-bold mb-4 text-darkGray">Helpful Information</h5>
            <ul class="list-disc pl-4 leading-8">
              <li>Specialist blood donors and clinical supervision.</li>
              <li>Increasing communication with our members.</li>
              <li>High quality assessment, diagnosis and treatment.</li>
              <li>Examine critically to ensure alignment.</li>
              <li>The extra care of a multi-disciplinary team.</li>
            </ul>
         </div>
      </div>
    </div>
  </section>
</template>
