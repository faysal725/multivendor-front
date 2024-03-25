<script setup>
import { useAuthStore } from "~~/stores/authStore";
import { useCrud } from "~~/composables/useCrud";

import { useCoordinateStore } from "~~/stores/coordinateStore";
import { useAddressStore } from "~~/stores/userAddressStore";

const { apiVersion } = useRuntimeConfig().public;

const crud = useCrud();
const coordsStore = useCoordinateStore();
const { getCoords, takeLatLngFormUser } = coordsStore;

const addressStore = useAddressStore();
const { getAddress, setAddress, takeCurrentLatLng } = addressStore;

const router = useRouter();

const showPass = ref(true);

const authStore = useAuthStore();
const { login, logout } = useAuth();

const form = ref({
  role: null,
  phone: null,
  password: null,
  password_confirmation: null,
  otp: null,
});

let phoneError = ref("");

var error = ref(false);
var loading = ref(false);
var errorMgs = ref("");
let forgetPassOn = ref(false);
let showForgetPass = ref(false);

const submit = async () => {
  loading.value = true;
  phoneError.value = "";
  let path = "/login";

  let body = {
    role: "customer",
    phone: form.value.phone,
    password: form.value.password,
  };

  await login(body).then((res) => {
    loading.value = false;
    if (res.status == 422) {
      error.value = true;
      if (res.errors["phone"] != null) {
        phoneError.value += res.errors["phone"] + "\n";
      }
      errorMgs.value = res.message;
      if (body.phone) {
        showForgetPass.value = true;
      }
    }
    if (res.status == 200) {
      if (authStore.auth.authenticated) {
        router.back();
      }
    }
  });
};

const logoutUser = () => {
  logout();

  addressStore.takeCurrentLatLng();
};

const forgetPassOtp = async (otpSend) => {
  errorMgs.value = "";
  forgetPassOn.value = true;
  let body;
  let forgetPassApi;
  if (otpSend) {
    forgetPassApi = apiVersion + "/send-otp";
    body = {
      phone: form.value.phone,
      forget_password: true,
    };
    await crud
      .store({
        body: body,
        path: forgetPassApi,
      })
      .then((res) => {});
  } else {
    forgetPassApi = apiVersion + "/forget-password";
    if (form.value.password !== form.value.password_confirmation) {
      errorMgs.value = "Password did not match";
      return;
    }
    body = {
      code: form.value.otp,
      phone: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
    };
    await crud
      .store({
        body: body,
        path: forgetPassApi,
      })
      .then((res) => {
        if (res.status == 200) {
          forgetPassOn.value = false;
        } else {
          errorMgs.value = "Resource not found";
        }
      });
  }
};

onMounted(() => {
  if (authStore.auth.authenticated) {
    router.back();
  }
});
</script>

<template>
  <div class="pt-10">
    <div
      class="flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[86vh]"
    >
      <div
        v-if="!forgetPassOn"
        class="mt-8 relative sm:mx-auto sm:w-full sm:max-w-md"
      >
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
          class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-light-border"
        >
          <p class="font-medium mb-4">Log in</p>

          <div>
            <div class="space-y-6">
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
            </div>

            <p
              @click="forgetPassOtp(true)"
              v-if="showForgetPass"
              class="text-xs text-warningRed cursor-pointer"
            >
              Forget Password?
            </p>

            <div class="px-8 mt-7">
              <ButtonLoginReg
                @click="submit"
                :name="'Log In'"
                :runLoader="loading"
              />
            </div>
          </div>

          <p class="text-sm text-black/70 mt-5 text-center">
            Don't have an account?
            <NuxtLink to="/signup">
              <span class="text-black font-medium ml-1 cursor-pointer"
                >Sign up</span
              >
            </NuxtLink>
          </p>
        </div>

        <div v-else>
          <ButtonLoginReg @click="logoutUser" :name="'Log out'" />
        </div>
      </div>

      <div v-else class="mt-8 relative sm:mx-auto sm:w-full sm:max-w-md">
        <div
          class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-light-border"
        >
          <p class="font-medium mb-4">Enter OTP</p>

          <div>
            <div class="space-y-6">
              <FormInputText
                v-model="form.otp"
                :title="'otp'"
                :label="'otp'"
                :type="'text'"
                :error="''"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.password"
                :title="'password'"
                :label="'password'"
                :type="'text'"
                :error="''"
                :oldValue="''"
              />

              <FormInputText
                v-model="form.password_confirmation"
                :title="'password_confirmation'"
                :label="'password_confirmation'"
                :type="'text'"
                :error="''"
                :oldValue="''"
              />
            </div>
            <p class="text-xs text-warningRed">{{ errorMgs }}</p>

            <div class="px-8 mt-7">
              <ButtonLoginReg
                @click="forgetPassOtp(false)"
                :name="'Submit'"
                :runLoader="loading"
              />
            </div>
          </div>

          <p class="text-sm text-black/70 mt-5 text-center">
            Don't have an account?
            <NuxtLink to="/signup">
              <span class="text-black font-medium ml-1 cursor-pointer"
                >Sign up</span
              >
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
