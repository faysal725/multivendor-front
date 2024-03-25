<script setup>
import {useCrud} from '~~/composables/useCrud';
import {useCoordinateStore} from '~~/stores/coordinateStore';



const coordsStore = useCoordinateStore()
const {
  takeLatLngFormUser,
  getCoords
} = coordsStore

if (process.client) {
  takeLatLngFormUser()
}

const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;
const path = apiVersion+'/products';

const products = ref()
const loaded = ref(false)
const sidescroll = ref(true)
const productData = ref([]);

const project = "Multivendor Ecommerce";



// const tabsData = [
//   {id:0 ,name:"Shopping"},
//   {id:1 ,name:"Groceries"},
//   {id:2 ,name:"Donation"},
// ]

let bestNearYou= []

let offers = [
  {id: 0, image:"../assets/images/offerImg/offerImage.png"},
  {id: 1, image:"../assets/images/offerImg/offerImage.png"},
  {id: 2, image:"../assets/images/offerImg/offerImage.png"},
]


let nearestShops= ref([])


let recentVisit= []

const availableMall = [
  {id: 0, image: "../assets/images/offerImg/offerImage.png", name:"Chittagong super market", dist: "0.2 km"},
  {id: 1, image: "../assets/images/offerImg/offerImage.png", name:"Chittagong super market", dist: "0.2 km"},
  {id: 2, image: "../assets/images/offerImg/offerImage.png", name:"super market", dist: "0.2 km"},
  {id: 3, image: "../assets/images/offerImg/offerImage.png", name:"super market", dist: "0.2 km"},
]

let productCategories= [
  {id:0, image:'../../assets/images/categoryImg/clothing.png', name:"Clothing"},
  {id:0, image:'../../assets/images/categoryImg/electronics.png', name:"Electronics"},
  {id:0, image:'../../assets/images/categoryImg/jwellery.png', name:"Jwellery"},
  {id:0, image:'../../assets/images/categoryImg/leather.png', name:"Leather"},
  {id:0, image:'../../assets/images/categoryImg/sport.png', name:"Sports"},
]

onMounted(async()=>{
    await crud.get({path:apiVersion+'/shop-categories'}).then((res)=>{
        productCategories = res.res.map((dt)=>{
          return {id:dt.id, image: networkImage(dt.image_path) , name:dt.name};
        })
    });
    await crud.get({path:apiVersion+'/shopping-malls'}).then((res)=>{

    });


    let latitude = coordsStore.getCoords().data.latitude
    let longitude = coordsStore.getCoords().data.longitude

    await crud.get({path:apiVersion+'/vendors/nearest?latitude='+latitude+'&longitude='+longitude}).then((res)=>{


        nearestShops.value = res.res.data.map((dt) => {
          return {
            id:dt.id, name: dt.name, dist: "2.33 km", slug: dt.slug
            }
          })
        })
  



});

const scrollRight =(e) => {
  // if (process.client){
  //   // scroll(x-coord, y-coord)
  //   window.scrollTo(0, 200)
  // }
  sidescroll.value = true 
  
}
</script>

<template>
        <div class="pt-20">

            <div class="px-7">
              <!-- tabs -->
              <CommonTabs :data="tabsData" />
            </div>            

            <div class="border-t border-t-light-border bg-mediumGray px-7">
              <!-- categories -->
              <ContainerHorizontal v-if="loaded" :allData="productCategories" :title="''" :shouldScroll="sidescroll">
                <CommonCardsCategoryCard v-for="data in productCategories" :key="data.id" :categoryData="data" />
              </ContainerHorizontal>
            </div>
          
            

            <!-- best picks near you -->
            <div class="px-7 mt-11 relative ">
              <ContainerHorizontal v-if="loaded"  :cardData="bestNearYou" :title="'Best Picks Near You'" >
                  <CommonCardsProductCard  v-for="data in bestNearYou" :key="data.id" :cardData="data" />
              </ContainerHorizontal>

              <div class="absolute top-24 right-2">
                <CommonRightScroller @click="scrollRight" />
              </div>
            </div>
            
            <!-- offers  -->
              <!-- <ContainerOffers  :offerData="offers" title="offers"/> -->
            <div class="px-7 mt-11 py-5 bg-mediumGray">
              <ContainerVertical :title="''" :items="'gallary'">
                <!-- <OfferCard v-for="data in offers" :key="data.id" :offerData="data" :title="offers"/> -->
                <CommonCardsOfferCard v-for="data in offers" :key="data.id" :offerData="data" :title="offers"/>
              </ContainerVertical>
            </div>
            


              <!-- nearest shops -->
            <div class="pb-10 my-12 px-7 border-b border-b-light-border relative">
              <ContainerHorizontal v-if="loaded"    :title="'Nearest Shops'" >
                <CommonCardsShop v-for="data in nearestShops" :key="data.id" :shopData="data" />
              </ContainerHorizontal>

              <!-- <div class="absolute top-14 right-2">
                <CommonRightScroller />
              </div> -->

            </div>

            
             <!-- recent visit -->

            <div class="px-7 mt-11 relative">
              <ContainerHorizontal :cardData="bestNearYou" :title="'Recent Visit'" >
                  <CommonCardsProductCard  v-for="data in recentVisit" :key="data.id" :cardData="data" />
              </ContainerHorizontal>

              <div class="absolute top-24 right-2">
                <CommonRightScroller />
              </div>
            </div>
            

            
            <!-- offers  -->
            <!-- <ContainerOffers  :offerData="availableMall" title="Available Malls"/> -->

            <div class="px-7 mt-11 py-5 bg-mediumGray relative">
              <ContainerHorizontal :title="''" items="'gallary'">
                <CommonCardsMarketCard v-for="data in availableMall" :key="data.id" :marketData="data" />
              </ContainerHorizontal>


              <div class="absolute top-16 right-2">
                <CommonRightScroller />
              </div>
            </div>

        </div>
</template>