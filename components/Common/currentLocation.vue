<script setup>
import { MapPinIcon } from '@heroicons/vue/24/outline';
import {useCoordinateStore} from '~~/stores/coordinateStore';
import {useAddressStore} from '~~/stores/userAddressStore';
import { useAuthStore } from '~~/stores/authStore';
import {useCrud} from '~~/composables/useCrud';
import useDetectOutsideClick from '../../composables/useInput'
import { useCartStore } from '~~/stores/cartStore';



const cartStore = useCartStore()
const {
  open,
  close, 
  getState,
  setProduct,
  getProducts,
  removeProduct,
  emptyCart,
  setProducts,
  getTotal,
  setSubTotal,
  getSubTotal,
  getDeliveryCharge,
  checkCartStatus,
} = cartStore

const pageData = {
    'redirectLink' : '/user-location/new'
}


const route = useRoute()

const authStore = useAuthStore();
const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
const path = apiVersion+'/user/delivery-addresses';
const coordsStore = useCoordinateStore()
const {

  getCoords,
  takeLatLngFormUser,
} = coordsStore

const addressStore = useAddressStore()
const {
    getAddress,
    setAddress,
    takeCurrentLatLng,
    getUserCoords,
    loadCoords,
    getCoordinate,
    clearCoords,
    setMapModal
} = addressStore


const componentRef = ref()

useDetectOutsideClick(componentRef, () => { 
  openDropdown.value = false
})


let openDropdown = ref(false)


// if (process.client) {

//     if (!authStore.auth.authenticated) {
//         takeCurrentLatLng()
//     }
// }


let address = ref([])

const dataLoad = async() => {
    if (authStore.auth.authenticated) {
    await crud.index({path:path}).then((res) => {
    if (res.res.length > 0) {
        address.value= []
        res.res.map(dt =>  address.value.push(dt))
    }
    })
}
}
// onMounted( ()=>{
//     dataLoad()
// })

onMounted(async()=>{
    
        dataLoad()

})




const setCurrentLocation = () => {
    takeCurrentLatLng()
    changePosition()
}


const gotoMap = () => {
    // navigateTo(pageData.redirectLink)
    // addressStore.clearCoords()
    addressStore.setMapModal(true)
}


const setLocation = (dt) => {


    let address = {
        'id': dt.id,
        'add': dt.street_address,
        'houseNo':dt.house_no,
        'floorNo':dt.floor_no,
        'lat': dt.latitude,
        'lng': dt.longitude,
        }

    addressStore.setAddress(address)

        
}

const changePosition = (dt) => {
    if (confirm("Cart will be empty if location is changed") == true) {
      cartStore.emptyCart()
        
    }
    if (dt) {
        setLocation(dt) 
    }

}


    


watch(
() => authStore.auth.authenticated,
() => {
    if (!authStore.auth.authenticated) {
        address.value=[]
    }
    else{
        dataLoad()
    }

},
{deep: true}
)

watch(
	() => addressStore.getCoordinate(),
	() => {
        if (addressStore.getCoordinate()) {
            // userDataLoad()
            dataLoad()
            addressStore.loadCoords(false)
        }
	},
	{deep: true}
)
</script>


<template>
<!-- :to="pageData.redirectLink"  -->
    <div ref="componentRef" @click="openDropdown =!openDropdown"  class=" p-1 rounded-md cursor-pointer">
        <!-- <p class="text-xs font-medium text-secondary-col pl-1">
            Your Location
        </p> -->
        <!-- <select class="bg-white font-medium outline-none" name="location" id="location">
            <option @click="setCurrentLocation" value="chittagong">Current</option>
            <option @click="gotoMap" value="chittagong">Set From Map</option>
            <option value="chittagong">delivery address</option>

            
        </select> -->

        <div class="font-normal text-sm outline-none h-full w-full gap-2" >
            
            <p v-if="addressStore.getAddress().address" class="cursor-pointer truncate text-white text-sm flex">
                <MapPinIcon class="w-5 h-5 text-white mr-1"/> 
               <div class="overflow-hidden flex items-center w-full text-white">
                 <marquee class="text-white">{{ addressStore.getAddress().address }}</marquee>
               </div>
            </p>

            <p v-else class="cursor-pointer pl-2 truncate flex gap-1 items-center text-white">
                <MapPinIcon class="w-4 h-4 text-white"/> 
                Address is not set yet
            </p>

            
            <div v-if = "openDropdown" class="fixed top-20 left-0 w-full px-4 sm:px-0 h-screen bg-black bg-opacity-80 z-10 flex justify-center items-center transition-all duration-500">
                <ul class="w-full h-[400px] overflow-y-auto bg-white max-w-[500px] p-1 space-y-1 z-20 -mt-20 rounded-xl shadow-md overflow-hidden ">
                    <p @click="setCurrentLocation"  class="border border-light-border text-sm hover:text-primary-col hover:bg-mediumGray rounded-md cursor-pointer p-2 flex gap-1 items-center">
                        <MapPinIcon class="w-4 h-4 text-primary-col"/>  
                        {{ addressStore.getAddress().address }}</p>
                    <li @click="gotoMap" class="border border-light-border text-sm text-primary-col hover:bg-mediumGray rounded-md cursor-pointer p-2 flex gap-1 items-center">
                        <MapPinIcon class="w-4 h-4 text-primary-col"/>     
                        Set From Map
                    </li>
                    <li  @click="changePosition(data)" v-for="data in address" :key="data.id" class="border border-light-border text-sm text-primary-col hover:bg-mediumGray rounded-md cursor-pointer p-2" >
                    {{ data.street_address }}
                    </li>
                </ul>
            </div>
        </div>

    </div>


</template>

<style scoped>
    .openDropdown {
        transition-property: width;
        transition-duration: 4s;
        transition-timing-function: linear;
        transition-delay: 2s;
        transition-timing-function: ease;
    }
</style>