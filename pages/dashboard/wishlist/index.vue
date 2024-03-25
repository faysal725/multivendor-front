<script setup>
import {useCrud} from '~~/composables/useCrud';
import { useAuthStore } from '~~/stores/authStore';


import {useAddressStore} from '~~/stores/userAddressStore';
import { TrashIcon, PencilSquareIcon} from '@heroicons/vue/24/outline';




definePageMeta({
  layout: 'userpanel',
  middleware:[
    'auth'
  ]
});



const pageData = {
    'redirectLink' : '/dashboard/edit-profile',
    'redirectLink2' : '/user-location/new',
}


const addressStore = useAddressStore()
const {
    getAddress,
    loadCoords,
    setAddress
} = addressStore


const authStore = useAuthStore();
const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
const path = apiVersion+'/user/wishlists';


// const path = apiVersion+'/user/delivery-addresses';

let wishList = ref()
let loading = ref(false)

let address = ref([])

const dataLoad = async () => {
    await crud.index({path:path}).then((res)=>{

        let products = []

        res.res.map((prd) => {
            if (prd.has_variation) {
              products.push({
                id:prd.id, 
                slug: prd.slug , 
                name: prd.name, 
                label: prd.label ? prd.label.name : '',
                price: prd.default_variation.price, 
                image: networkImage(prd.thumbnail_path), 
                rating: prd.review,
                discountType: prd.default_variation.discount_type,
                discount: prd.default_variation.discount,
                discountPrice: prd.default_variation.discounted_price,
                hasVariation: prd.has_variation,
                allInfo: prd
              })
            } else{
              products.push({
                id:prd.id, 
                slug: prd.slug , 
                name: prd.name, 
                label: prd.label ? prd.label.name : '',
                price: prd.price, 
                image: networkImage(prd.thumbnail_path), 
                rating: prd.review,
                discountType: prd.discount_type,
                discount: prd.discount,
                discountPrice: prd.discounted_price,
                hasVariation: false,
                allInfo: prd
              })
            }

          } )

        wishList.value = products
        loading.value = true
    })


}

// randomStore.value = res.res.map((dt) => {
//         let products = []

//           dt.products.map((prd) => {
//             if (prd.has_variation) {
//               allData.products.push({
//                 id:prd.id, 
//                 slug: prd.slug , 
//                 name: prd.name, 
//                 label: prd.label ? prd.label.name : '',
//                 price: prd.default_variation.price, 
//                 image: networkImage(prd.thumbnail_path), 
//                 rating: prd.review,
//                 discountType: prd.default_variation.discount_type,
//                 discount: prd.default_variation.discount,
//                 discountPrice: prd.default_variation.discounted_price,
//                 hasVariation: prd.has_variation,
//                 allInfo: prd
//               })
//             } else{
//               allData.products.push({
//                 id:prd.id, 
//                 slug: prd.slug , 
//                 name: prd.name, 
//                 label: prd.label ? prd.label.name : '',
//                 price: prd.price, 
//                 image: networkImage(prd.thumbnail_path), 
//                 rating: prd.review,
//                 discountType: prd.discount_type,
//                 discount: prd.discount,
//                 discountPrice: prd.discounted_price,
//                 hasVariation: false,
//                 allInfo: prd
//               })
//             }

//           } )
//         return allData
//         })


onMounted(()=>{

    dataLoad()
});


</script>

<template>
    <section class="px-10  pt-28 w-full flex flex-col gap-5">

        <div v-if="loading" class="">
            <p class="text-xl font-medium">Wishlist</p>

            <div class="flex gap-3 flex-wrap">
                <CommonCardsProductCard  v-for="item in wishList" :key="item.id" :cardData="item"  class="min-w-[220px] sm:min-w-[265px] content" />
            </div>

        </div>

        <div v-else >
          <ContainerHorizontal  :allData="wishList" :title="'Wishlist'" :shouldScroll="sidescroll">
            <div class="mt-4 flex gap-4" >
                <ContainerAnimationPulse v-for="i in 9" :key="i" customClass="h-40 w-60" />
            </div>
          </ContainerHorizontal>
        </div>
    </section>

    
</template>