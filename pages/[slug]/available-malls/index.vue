<script setup>
import {useCrud} from '~~/composables/useCrud';
import {useCoordinateStore} from '~~/stores/coordinateStore';
import {useAddressStore} from '~~/stores/userAddressStore';
import { useAuthStore } from '~~/stores/authStore';
import {useProductStore} from '~~/stores/productStore';

const authStore = useAuthStore();
const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
const path = apiVersion+'/products';

const shouldLocationOn = ref(false)

const coordsStore = useCoordinateStore()
const {
  takeLatLngFormUser,
  getCoords
} = coordsStore

const addressStore = useAddressStore()

const {
  getAddress,
  setAddress,
  takeCurrentLatLng,
  getUserCoords
} = addressStore

const productStore = useProductStore()
const {

  insertProducts,
  emptyApiData,
  getAllProducts
} = productStore


  // shouldLocationOn

  if (addressStore.getAddress().lat && addressStore.getAddress().lng) {
    shouldLocationOn.value = true
  } 

  // function takeLocation() {

  //   shouldLocationOn.value = true 
  //   addressStore.takeCurrentLatLng()
  // }
  
// if (process.client) {
//   takeLatLngFormUser()

// }

// let address = {
//   'add': 'current',
//   'houseNo':'',
//   'floorNo':'',
//   'lat': coordsStore.getCoords().data.latitude,
//   'lng': coordsStore.getCoords().data.longitude,
// }
// addressStore.setAddress(address)


const route = useRoute()
const category = route.fullPath.replace(/\//g, "");



const products = ref()
const loaded = ref(false)
const sidescroll = ref(true)
const productData = ref([]);

const project = "Multivendor Ecommerce";



let bestNearYou= []

// let offers = [
//   {id: 0, image:"../assets/images/offerImg/offerImage.png"},
//   {id: 1, image:"../assets/images/offerImg/offerImage.png"},
//   {id: 2, image:"../assets/images/offerImg/offerImage.png"},
// ]

let offers = ref([])
let nearestShops= ref([])
let randomStore= ref([])
let recentVisit= []
let recentVisitedProduct= ref([])
let availableMall = ref([])
let subCategories= ref([])
let brands   = ref([])


let pageInfo = ref({
    presentPage : 1,
    totalPage: null
})



const dataLoad = async () => {

    // let latitude = await coordsStore.getCoords().data.latitude
    // let longitude = await coordsStore.getCoords().data.longitude

    let latitude =  addressStore.getAddress().lat
    let longitude =  addressStore.getAddress().lng

    // let nearestShopApi = apiVersion+'/vendors/nearest?latitude='+latitude+'&longitude='+longitude+'&category='+category

    // if (productStore.getAllProducts()[nearestShopApi]){
    //   nearestShops.value = productStore.getAllProducts()[nearestShopApi]
    // } else{
    //   await crud.get({path:nearestShopApi}).then((res)=>{

    //     if (Object.keys(res.res.data).length > 1) {
    //       nearestShops.value = res.res.data.map((dt) => {
    //       return {
    //         id:dt.id, name: dt.name, dist: "2.33 km", slug: dt.slug, logo: dt.logo_path
    //         }
    //       })  

    //       productStore.insertProducts(nearestShopApi, toRaw(nearestShops.value))
    //     }

    //   })
    // }




    let mallsApi = apiVersion+'/shopping-malls/nearest?latitude='+latitude+'&longitude='+longitude+'&page='+pageInfo.value.presentPage

    if (productStore.getAllProducts()[mallsApi]) {
    
      availableMall.value = productStore.getAllProducts()[mallsApi]
      loaded.value = true
    } else{
      await crud.get({path:mallsApi}).then((res)=>{

        pageInfo.value.presentPage = res.res.from 
        pageInfo.value.totalPage = res.res.total
        let mallData= res.res.data.map((dt) => {
          return {
            id:dt.id, image:networkImage(dt.image_path), name: dt.name, dist: "2.33 km", slug: dt.slug
          }
        })

        availableMall.value = [...availableMall.value, ...mallData]

        productStore.insertProducts(mallsApi, toRaw(availableMall.value))

      });
      loaded.value = true
    }






}

onMounted(()=>{

    dataLoad()

});




const scrollRight =(e) => {
  // if (process.client){
  //   // scroll(x-coord, y-coord)
  //   window.scrollTo(0, 200)
  // }
  sidescroll.value = true 
  
}

watch(
	() => addressStore.getAddress().address,
	() => {
     dataLoad()
	},
	{deep: true}
)

watch(
	() => addressStore.getAddress().lat && addressStore.getAddress().lng,
	() => {

    if (addressStore.getAddress().lat && addressStore.getAddress().lng) {
      shouldLocationOn.value = true
    }else{
      shouldLocationOn.value = false
    }
	},
	{deep: true}
)



const handleScroll = (e) => {
    let { scrollTop, clientHeight, scrollHeight } = e.target;
    

        // this.showMore.allLinks = this.products.links


        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 48) {


            if (pageInfo.value.presentPage < pageInfo.value.totalPage) {
                pageInfo.value.presentPage++
                dataLoad()
            }
            
        }
    
}


window.addEventListener('scroll', handleScroll);


</script>

<template>

        <div v-if="!shouldLocationOn" class="fixed bg-overlay/70 w-full h-full z-40 flex justify-center items-center">
          <NuxtLink to="/user-location/new" 
          class="bg-primary-col px-2 p-1  rounded-xl text-white hover:text-black hover:bg-white">Turn on location </NuxtLink>
        </div>

        
        <div v-else class="pt-28 px-4 sm:px-6 lg:px-10 max-w-full min-h-screen mx-auto bg-white z-10 relative">
          
            
            <!-- ContainerVertical  v-if="data.products.length > 0" :title="''" class="w-full" -->

            <!-- marketCard -->
            <!-- <div v-if="loaded" class="pb-5 bg-white relative">
              <ContainerVertical :title="''"  class="w-full">
                <CommonCardsMarket v-for="data in availableMall" :key="data.id" :marketData="data" />
              </ContainerVertical>


            </div> -->

            <div v-if="loaded" class="pb-5 bg-white relative">

                <div  class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    <div class="" v-for="data in availableMall" :key="data.id" >
                        <CommonCardsMarket  :marketData="data" />
                    </div>
                </div>



            </div>



            <!-- marketCard end -->
            <!-- marketCard loading -->
            <div v-else >
                <ContainerHorizontal  :allData="marketCard" :title="''" :shouldScroll="sidescroll">
                  <div class="mt-4 flex gap-4" >
                      <ContainerAnimationPulse v-for="i in 7" :key="i" customClass="h-[190px] w-[300px]" />
                  </div>
                </ContainerHorizontal>
            </div>
            <!-- marketCard loading end-->
            
        </div>
</template>


