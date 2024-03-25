<script setup>
import { useAuthStore } from '~~/stores/authStore';

import {useAddressStore} from '~~/stores/userAddressStore';



const addressStore = useAddressStore()
const {
    getAddress,
    setAddress
} = addressStore



const showPass = ref(true)

const authStore = useAuthStore();
const {login , logout, registration} = useAuth();

// console.log(useAuth())
const form = ref({
  name: null,
  phone: null,
  password: null,
  confirm_password: null,
  code:null,
  contact_name:null,
  contact_number: null,
  streetAddress:null,
  houseNo:null,
  floorNo:null,
  latitude:null,
  longitude: null 
})


let nameError = ref("")
let phoneError = ref("")
var opencode = ref(false)

var error = ref(false);
var loading = ref(false);
var errorMgs = ref("");



onMounted(()=> {
  console.log(addressStore.getAddress())
  if (
    addressStore.getAddress().address == '' || 
    addressStore.getAddress().houseNo == '' ||
    addressStore.getAddress().floorNo == '' ||
    addressStore.getAddress().lat == '' ||
    addressStore.getAddress().lng == '' 
   ) {
    navigateTo('/user-location/new')
  }
  form.value.streetAddress = addressStore.getAddress().address
  form.value.houseNo = addressStore.getAddress().houseNo
  form.value.floorNo = addressStore.getAddress().floorNo
  form.value.latitude = addressStore.getAddress().lat
  form.value.longitude = addressStore.getAddress().lng
})



const submit = async()=>{
  loading.value = true;
  phoneError.value = "";
  let path
  if (!opencode.value) {
    path = `/send-otp`
  }else{
    path = `/register`
  }

  let body = {
      name: form.value.name,
      phone: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.confirm_password,
      code:form.value.code,
      contact_name: form.value.contact_name,
      street_address: form.value.streetAddress,
      house_no: form.value.houseNo,
      floor_no: form.value.floorNo,
      latitude: form.value.latitude,
      longitude: form.value.longitude
  }
  await registration(body, path).then((res)=>{
    if(res.status == 422){
        error.value = true;
      if(res.errors['name'] != null){
        nameError.value += res.errors['name'] + '\n';
      }
      if(res.errors['phone'] != null){
        phoneError.value += res.errors['phone'] + '\n';
      }
      errorMgs.value = res.message;
    }
    if(res.status == 200){
      if (opencode.value) {
        return navigateTo('/')
      }
      opencode.value = true

    }
  })




}


const resendOTP = async() => {
  
  let path = "/resend-otp"
  let body = {
      name: form.value.name,
      phone: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.confirm_password,
      code:form.value.code,
      contact_name: form.value.contact_name,
      street_address: form.value.streetAddress,
      house_no: form.value.houseNo,
      floor_no: form.value.floorNo,
      latitude: form.value.latitude,
      longitude: form.value.longitude
  }

  await registration(body, path)
}
console.log(authStore.auth.authenticated)
// "code":"6387",
//     "name":"Fahim",
//     "phone":"8801706577176",
//     "password":"password",
//     "contact_name":"Fahim",
//     "contact_number":"01706577176",
//     "street_address":"1312 Ati Bazar-Kalatiya Rd, Dhaka 1312",
//     "house_no":"B5",
//     "floor_no":"3 A",
//     "latitude":"23.7281735",
//     "longitude":"90.3326481"


watch(
	() => form.value.name,
	() => {
     
	},
	{deep: true}
)
</script>

<template>
  <div class="pt-10">
    <div class="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">

        <!-- close icon  -->
        <div class="mt-8 relative sm:mx-auto sm:w-full sm:max-w-md">
            <div class="absolute top-3 right-4">
                <NuxtLink to="/">
                <SvgComponentCloseIcon 
                :stroke="2" 
                :height="9" 
                :width="5" 
                :color="'fill-mediumBlue'" 
                />
                </NuxtLink>
            </div>


            <div v-if="!authStore.auth.authenticated" class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

                <p class="font-medium mb-4">Sign up</p>
                
                <!-- <div class="flex flex-col gap-2">
                    

                    <div class="w-full bg-lightBlue py-2 rounded-md font-medium text-black flex justify-center items-center gap-2">
                        <img class="h-6" src="../assets/icons/googleIcon.png" alt="">
                        <button>Continue with Google</button>
                    </div>

                    <div class="w-full bg-lightBlue py-2 rounded-md font-medium text-black flex justify-center items-center gap-2">
                        <SvgComponentFacebookIcon 
                        :stroke="2" 
                        :height="9" 
                        :width="5" 
                        :color="'fill-mediumBlue'" 
                        />
                        <button>Continue with Facebook</button>
                    </div>
                </div>

                <div class="my-8 relative">
                    <div class=" border-b border-secondary-col/25">
                    </div>
                    <p class="absolute -top-3 left-[44%] px-3	bg-white text-secondary-col">OR</p>
                </div> -->

                <form @submit.prevent="submit"  action="#" method="POST">

                    <div class="space-y-6" v-if="!opencode">
                        <FormInputText 
                        v-model="form.name"
                        :title= "'Full Name'"
                        :label="'name'"
                        :type="'text'"
                        :error="''"
                        :oldValue="''"
                        />

                        <FormInputText 
                        v-model="form.phone"
                        :title= "'Phone'"
                        :label="'phone'"
                        :type="'text'"
                        :error="phoneError"
                        :oldValue="''"
                        />

                        <FormInputText 
                        v-model="form.contact_name"
                        :title= "'contact_name'"
                        :label="'contact_name'"
                        :type="'text'"
                        :error="''"
                        :oldValue="''"
                        />


                        <FormInputText 
                        v-model="form.contact_number"
                        :title= "'contact_number'"
                        :label="'contact_number'"
                        :type="'text'"
                        :error="''"
                        :oldValue="''"
                        />


                        <FormInputText 
                        v-model="form.password"
                        :title= "'Password'"
                        :label="'password'"
                        :type="'password'"
                        :error="''"
                        :oldValue="''"
                        />

                        <FormInputText 
                        v-model="form.confirm_password"
                        :title= "'Confirm Password'"
                        :label="'confirm-password'"
                        :type="'password'"
                        :error="''"
                        :oldValue="''"
                        />
                    </div>

                    <div v-else >
                        <FormInputText 
                        v-model="form.code"
                        :title= "'code'"
                        :label="'OTP'"
                        :type="'text'"
                        :error="codeError"
                        :oldValue="''"
                        />
                        <p class="text-xs mt-2 text-mediumBlue hover:underline cursor-pointer" @click="resendOTP">Resend OTP</p>
                    </div>

                    <div class="px-8 mt-7">
                    <ButtonLoginReg :name="'Sign Up'" :runLoader="loading"/>
                    </div>
                
                </form>
                
                <p class="text-sm text-black/70 mt-5 text-center">Already have an account? 
                    <NuxtLink to="/login">
                        <span class="text-black font-medium ml-1">Log in</span>
                    </NuxtLink>
                </p>

                <p class="text-xs text-black/70 mt-5 text-center">By signing up, you agree to our 
                    <span class="text-secondary-col  border-b">Privacy Policy</span>
                    and
                    <span class="text-secondary-col  border-b">Terms of Service</span>
                </p>
                
            </div>

            <div v-else class="px-8 mt-7">
                <ButtonLoginReg @click="logout" :name="'Log out'" :runLoader="loading"/>
            </div>
        </div>
    </div>

  </div>
</template>