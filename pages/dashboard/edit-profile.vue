<script setup>
import {useCrud} from '~~/composables/useCrud';
import { useAuthStore } from '~~/stores/authStore';

const authStore = useAuthStore();
const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
const path = apiVersion+'/user';




definePageMeta({
  layout:[
    'userpanel'
  ],
  middleware:[
    'auth'
  ]
});


const pageData = {
    'redirectLink' : '/dashboard'
}

const body = ref({
    name: null,
    email: null,
    phone: null,
    shippingAddress: null,
    billingAddress: null,
    profileImg: ''
});
const errors = ref({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
    billingAddress: ''
});

const response = ref({
    name: '',
    email: '',
    phone: '',
    shippingAddress: '',
    billingAddress: ''
})

let oldProfileImg = ref('')
let userProfile = ref()
const loading = ref(false)


const save = async () => {
    loading.value = false
    await crud.update({
        body :  {
            '_method': "PUT",
            "name": body.value.name,
            "image": body.value.profileImg
        },
        path: path+'/update-profile'
       }).then((res) => {
            dataLoad()
       })
}


const dataLoad = async () => {

    await crud.index({path:path}).then((res)=>{


        body.value.name = res.res.name 
        body.value.profileImg = res.res.profile_photo_path
        oldProfileImg.value = networkImage(res.res.profile_photo_path)
        body.value.phone = res.res.phone
        // userProfile.value = res.res
        loading.value = true
    })


}


onMounted(()=>{

    dataLoad()

});

</script>

<template>
    <section class="px-10  pt-28 max-w-3xl flex flex-col gap-5">

        <div class="flex justify-between pr-28">
            <p class="text-xl font-semibold">Edit Profile</p>
            <NuxtLink :to="pageData.redirectLink" class="text-xs font-semibold text-mediumBlue hover:text-black underline">Go Back</NuxtLink>
        </div>

        <div>
            <div v-if="loading" class="grid grid-cols-1 gap-10 pr-28">

                <div class="rounded-lg bg-white rounded-full bg-overlay/50 w-fit">
                    <img class="h-28 w-28" v-if="oldProfileImg !== ''" :src="oldProfileImg" alt="">
                </div>

                
                <div class="rounded-lg bg-white">
                    <FormInputText 
                    v-model="body.name"
                    :title= "'User Name'"
                    :label="'name'"
                    :type="'text'"
                    :error="errors.name"
                    :oldValue="body.name"
                    />
                </div>

                <!-- <div class="rounded-lg bg-white">
                    <FormInputText 
                    v-model="body.email"
                    :title= "'Email'"
                    :label="'Email'"
                    :type="'text'"
                    :error="errors.email"
                    :oldValue="''"
                    />
                </div> -->

                <div class="rounded-lg bg-white">
                    <FormInputText 
                    v-model="body.phone"
                    :title= "'Contact Number'"
                    :label="'contactNo'"
                    :type="'phone'"
                    :error="errors.phone"
                    :oldValue="body.phone"
                    />
                </div>

<!-- 
                <div class="rounded-lg bg-white">
                    <FormInputDropdown 
                        v-model="body.brand"
                        :title= "'Select Brand'"
                        :label="'brand'"
                        :type="'dropdown'"
                        :options="brandOptions.value"
                        :oldValue="response.brand_id"
                        :error="errors.parent"
                    />

                </div>
                <div class="rounded-lg bg-white">
                    <FormInputText 
                    v-model="body.description"
                    :title= "'Product description'"
                    :label="'description'"
                    :type="'text'"
                    :error="errors.description"
                    :oldValue="response.description"
                    />
                </div>
                <div class="rounded-lg bg-white">
                    <FormInputText 
                    v-model="body.content"
                    :title= "'Product Content'"
                    :label="'content'"
                    :type="'text'"
                    :error="errors.content"
                    :oldValue="response.content"
                    />
                </div> -->


                <div class="rounded-lg bg-white">
                    <VueFilepond
                    v-model="body.profileImg"
                    key="file1"
                    accept="image/*"
                    :id="'image_upload_thumbnail'"
                    :labelIdle="'Upload Logo'"
                    :multiple="false"
                    />
                </div>

                <div class="flex justify-end ">
                    <ButtonPrimary @click="save" :name="'Save'" />
                </div>
                
            </div>
            

        </div>
    </section>
</template>