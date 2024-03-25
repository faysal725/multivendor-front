<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const pageData = {
  redirectLink: "/dashboard/edit-profile",
  redirectLink2: "/user-location/new",
};

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const { login, logout } = useAuth();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/change-password";

const form = ref({
  currentPass: null,
  password: null,
  passConfirmation: null,
});

const error = ref({
  currentPass: "",
  password: "",
  passConfirmation: "",
  global: "",
});

const changePassword = async () => {
  error.value.passConfirmation = "";
  error.value.global = "";
  error.value.currentPass = "";

  let body = {
    current_password: form.value.currentPass,
    password: form.value.password,
    password_confirmation: form.value.passConfirmation,
  };
  // console.log(body)
  if (body.current_password && body.password && body.password_confirmation) {
    if (body.password == body.password_confirmation) {
      await crud
        .store({
          body: body,
          path: path,
        })
        .then((res) => {
          if (res.status == 422) {
            error.value.global = res.message;
          } else {
            logout();
            navigateTo("/login");
          }
        });
    } else {
      error.value.passConfirmation =
        "Did not match with the password you choose";
    }
  } else {
    error.value.global = "Every field have to be filled";
  }
};
</script>

<template>
  <section class="px-10 pt-28 max-w-3xl flex flex-col gap-5">
    <p class="text-xl font-semibold">Change Password</p>
    <div
      class="w-fit bg-white border border-light-border shadow-sm p-5 text-sm flex rounded-md justify-start items-start"
    >
      <div class="w-80 flex flex-col gap-6">
        <p class="text-warningRed text-xs">{{ error.global }}</p>
        <FormInputText
          v-model="form.currentPass"
          :title="'Current Password'"
          :label="'currentPass'"
          :type="'text'"
          :error="error.currentPass"
          :oldValue="''"
        />

        <FormInputText
          v-model="form.password"
          :title="'New Password'"
          :label="'newPass'"
          :type="'text'"
          :error="error.password"
          :oldValue="''"
        />

        <FormInputText
          v-model="form.passConfirmation"
          :title="'Confirm Password'"
          :label="'confirmPass'"
          :type="'text'"
          :error="error.passConfirmation"
          :oldValue="''"
        />

        <ButtonPrimary
          @click="changePassword"
          :name="'Submit'"
          class="bg-primary-col"
        />
      </div>
    </div>
  </section>
</template>
