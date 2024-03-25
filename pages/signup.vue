<script setup>
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { useCrud } from "~~/composables/useCrud";

const addressStore = useAddressStore();
const { getAddress, setAddress } = addressStore;

const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const showPass = ref(true);

const router = useRouter();

const authStore = useAuthStore();
const { login, logout, registration } = useAuth();

const form = ref({
  name: null,
  phone: null,
  password: null,
  confirm_password: null,
  code: null,
  contact_name: null,
  contact_number: null,
  streetAddress: null,
  houseNo: null,
  floorNo: null,
  latitude: null,
  longitude: null,
});

let nameError = ref("");
let phoneError = ref("");
var opencode = ref(false);
let codeError = ref("");
let otpResend = ref("");

var error = ref(false);
var loading = ref(false);
var errorMgs = ref("");

onMounted(() => {
  if (
    addressStore.getAddress().address == "" ||
    addressStore.getAddress().houseNo == "" ||
    addressStore.getAddress().floorNo == "" ||
    addressStore.getAddress().lat == "" ||
    addressStore.getAddress().lng == ""
  ) {
    navigateTo("/user-location/new");
  }
  form.value.streetAddress = addressStore.getAddress().address;
  form.value.houseNo = addressStore.getAddress().houseNo;
  form.value.floorNo = addressStore.getAddress().floorNo;
  form.value.latitude = addressStore.getAddress().lat;
  form.value.longitude = addressStore.getAddress().lng;
});

const submit = async () => {
  loading.value = true;
  phoneError.value = "";
  let path;
  if (!opencode.value) {
    path = `/send-otp`;
  } else {
    path = `/register`;
  }

  let body = {
    name: form.value.name,
    phone: form.value.phone,
    password: form.value.password,
    password_confirmation: form.value.confirm_password,
    code: form.value.code,
    contact_name: form.value.name,
    street_address: form.value.streetAddress,
    house_no: form.value.houseNo,
    floor_no: form.value.floorNo,
    latitude: form.value.latitude,
    longitude: form.value.longitude,
  };
  await registration(body, path).then((res) => {
    loading.value = false;
    if (res.status == 422) {
      error.value = true;
      if (res.errors["name"] != null) {
        nameError.value += res.errors["name"] + "\n";
      }
      if (res.errors["phone"] != null) {
        phoneError.value += res.errors["phone"] + "\n";
      }
      errorMgs.value = res.message;
    }
    if (res.status == 200) {
      if (opencode.value) {
        return navigateTo("/");
      }
      opencode.value = true;

      setTimeout(() => {
        otpBtnStatus.value = true;
      }, 30000);
    }
  });
};

let otpBtnStatus = ref(false);

const resendOTP = async () => {
  loading.value = true;
  let path = "/resend-otp";
  let body = {
    name: form.value.name,
    phone: form.value.phone,
    password: form.value.password,
    password_confirmation: form.value.confirm_password,
    code: form.value.code,
    contact_name: form.value.name,
    street_address: form.value.streetAddress,
    house_no: form.value.houseNo,
    floor_no: form.value.floorNo,
    latitude: form.value.latitude,
    longitude: form.value.longitude,
  };

  await crud
    .store({
      body: body,
      path: apiVersion + path,
    })
    .then((res) => {
      loading.value = false;
      otpResend.value =
        "OTP resend successfully!!! Please wait 30 seconds then try again";
      otpBtnStatus.value = true;
      // console.log(res)

      setTimeout(() => {
        otpBtnStatus.value = false;
      }, 30000);
    });
};

watch(
  () => form.value.name,
  () => {},
  { deep: true }
);

onMounted(() => {
  if (authStore.auth.authenticated) {
    router.back();
  }
});
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

        <div
          v-if="!authStore.auth.authenticated"
          class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
        >
          <p class="font-medium mb-4">Sign up</p>

          <form @submit.prevent="submit" action="#" method="POST">
            <div class="space-y-6" v-if="!opencode">
              <FormInputText
                v-model="form.name"
                :title="'Full Name'"
                :label="'name'"
                :type="'text'"
                :error="''"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.phone"
                :title="'Phone'"
                :label="'phone'"
                :type="'text'"
                :error="phoneError"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.password"
                :title="'Password'"
                :label="'password'"
                :type="'password'"
                :error="''"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.confirm_password"
                :title="'Confirm Password'"
                :label="'confirm-password'"
                :type="'password'"
                :error="''"
                :oldValue="''"
              />
            </div>

            <div v-else>
              <FormInputText
                v-model="form.code"
                :title="'code'"
                :label="'OTP'"
                :type="'text'"
                :error="codeError"
                :oldValue="''"
              />
              <p class="text-xs text-warningRed mt-2">{{ otpResend }}</p>
              <p
                v-if="otpBtnStatus"
                class="text-xs mt-2 text-mediumBlue hover:underline cursor-pointer"
                @click="resendOTP"
              >
                Resend OTP
              </p>
            </div>

            <div class="px-8 mt-7 relative">
              <!-- <span class="bg-primary-col/50 h-full w-72 absolute"></span> -->
              <ButtonLoginReg :name="'Sign Up'" :runLoader="loading" />
            </div>
          </form>

          <p class="text-sm text-black/70 mt-5 text-center">
            Already have an account?
            <NuxtLink to="/login">
              <span class="text-black font-medium ml-1">Log in</span>
            </NuxtLink>
          </p>

          <p class="text-xs text-black/70 mt-5 text-center">
            By signing up, you agree to our
            <span class="text-secondary-col border-b">Privacy Policy</span>
            and
            <span class="text-secondary-col border-b">Terms of Service</span>
          </p>
        </div>

        <div v-else class="px-8 mt-7">
          <ButtonLoginReg
            @click="logout"
            :name="'Log out'"
            :runLoader="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>
