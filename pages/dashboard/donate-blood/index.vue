<script setup>
import { useCrud } from "~~/composables/useCrud";
import { useAuthStore } from "~~/stores/authStore";

import { useAddressStore } from "~~/stores/userAddressStore";
import { TrashIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});

const addressStore = useAddressStore();
const { getAddress, loadCoords, setAddress } = addressStore;

const authStore = useAuthStore();
const crud = useCrud();
const { apiVersion } = useRuntimeConfig().public;
const path = apiVersion + "/blood-donation";

let donorProfile = ref();
let loading = ref(false);

const profileLoad = async () => {
  await crud.index({ path: path + "/profile" }).then((res) => {
    if (Object.keys(res.res).length > 0) {
      donorProfile.value = res.res;
      form.value.blood_type = res.res.blood_type;
      form.value.last_donated = res.res.last_donated;
      form.value.status = res.res.status;
    } else {
    }

    loading.value = true;
  });
};

onMounted(() => {
  profileLoad();
});

const form = ref({
  blood_type: null,
  last_donated: null,
  status: "inactive",
});

// blood
var bloodCategoryOptions = ref([
  { key: "A+", value: "A+" },
  { key: "A-", value: "A-" },
  { key: "B+", value: "B+" },
  { key: "B-", value: "B-" },
  { key: "O+", value: "O+" },
  { key: "O-", value: "O-" },
  { key: "Ab+", value: "Ab+" },
  { key: "AB-", value: "AB-" },
]);
const statusOptions = [
  {
    key: "active",
    value: "active",
  },
  {
    key: "inactive",
    value: "inactive",
  },
];
const submit = async ({ signup }) => {
  loading.value = false;
  let endpoint;
  if (signup) {
    endpoint = path + "/signup";
  } else {
    endpoint = path + "/profile-update";
  }

  await crud
    .store({
      body: form.value,
      path: endpoint,
    })
    .then((res) => {
      if (res.status == 200) {
        profileLoad();
      }
    });
};
</script>

<template>
  <section v-if="loading" class="px-4 md:px-10 pt-28 w-full">
    <p class="text-xl font-semibold mb-5">Donor Profile</p>

    <div class="w-80 flex flex-col gap-4 border p-3 py-5 rounded-lg">
      <p v-if="!donorProfile" class="">Sign up as a donor</p>

      <p v-else class="">Edit your donor profile</p>
      <FormInputDropdown
        v-model="form.blood_type"
        :title="'Blood Type'"
        :label="'blood_type'"
        :type="'dropdown'"
        :options="bloodCategoryOptions"
        :oldValue="form.blood_type"
        :error="''"
      />

      <FormInputText
        v-model="form.last_donated"
        :title="'Last Donated Date'"
        :label="'last_donated'"
        :type="'date'"
        :error="''"
        :oldValue="form.last_donated"
      />

      <FormInputDropdown
        v-model="form.status"
        :title="'Status'"
        :label="'status'"
        :type="'dropdown'"
        :options="statusOptions"
        :oldValue="form.status"
        :error="''"
      />

      <button
        v-if="!donorProfile"
        @click="submit({ signup: true })"
        class="w-fit rounded-lg bg-primary-col px-2 p-2 text-white"
      >
        Proceed
      </button>
      <button
        v-else
        @click="submit({ signup: false })"
        class="w-fit rounded-lg bg-primary-col px-2 p-2 text-white"
      >
        Update
      </button>
    </div>
  </section>

  <section
    v-else
    class="px-10 pt-28 flex flex-col xl:grid grid-cols-2 gap-4 w-full max-h-3"
  >
    <p class="text-xl font-semibold mb-5">Donor Profile</p>
    <ContainerAnimationPulse customClass=" h-[300px] w-full" />

    <ContainerAnimationPulse customClass=" h-[300px] w-full" />

    <ContainerAnimationPulse customClass=" h-[300px] w-full" />
  </section>
</template>
