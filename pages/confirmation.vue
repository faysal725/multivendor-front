<script setup>
import { getGeolocation } from '~~/composables/utils';
const payments=[
    {id:0, name: "cash on delivery"},
    {id:1, name: "Bkash"},
]




// const successCallback = (position) => {

// };

// const errorCallback = (error) => {

// };



let location

if (process.client) {
    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    location = getGeolocation()

}

let products = [
    {name: "T-shirt", color: "red", price: "30 tk"}
]
function enterData() {



    if (JSON.parse(localStorage.getItem("cartItems")) === null) {
        localStorage.setItem("cartItems", JSON.stringify(products))
    }else{
        let allItems   = JSON.parse(localStorage.getItem("cartItems"))
        localStorage.setItem("cartItems", JSON.stringify([...products, ...allItems]))
    }

    
}

function removeDeta() {
    localStorage.setItem("cartItem", "wateeeer")
}

</script>

<template>


    <div class="bg-secondary-col/20 pt-20 ">
        
        <div class="flex flex-col bg-white text-3xl gap-5 max-w-5xl px-4 mx-auto pt-10 pb-20">
            
            <ContainerAddress :title="'Delivery Address'" :edit="true">
                <CommonCardsMap :description="'Hallishor Cantonment, Chittagong'"/>
            </ContainerAddress>
            
            <ContainerAddress :title="'Personal Details'" :edit="true">
                <div class="text-base text-black">
                    <p>{{ location }}</p>
                    <p>Muntasir Al Adnan</p>
                    <p>017128722756</p>
                </div>
            </ContainerAddress>


            <div class="flex gap-2">
                <button @click="enterData" class="bg-warningRed text-sm">add one</button>
                <button class="bg-warningRed text-sm">remove one</button>
            </div>


            <ContainerAddress :title="'Payment Details'" :edit="false">
                <div class="flex flex-col gap-2">
                    <CommonCardsPaymentMehod v-for="data in payments" :key="data.id"  :method="data" />
                </div>
            </ContainerAddress>



            <p @click="enterAnother"  class="text-base text-red mt-5">Have any voucher?</p>

            <ButtonSecondary :name="'place Order'" />
        </div>
    </div>
</template>