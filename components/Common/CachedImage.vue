<script setup>
import {useCrud} from '~~/composables/useCrud'


const props = defineProps({
    image: String,
    customClass: String,
})

const crud = useCrud();
const {apiVersion} = useRuntimeConfig().public;

const path = apiVersion+'/images';


 
onMounted(  async()=>{

if (process.client) {

    
    let imageUrl = props.image
    let localStorageKey = props.image;





    // Retrieve and display the cached image
    getAndDisplayCachedImage(localStorageKey);

    function getAndDisplayCachedImage(localStorageKey) {

        if (localStorage.getItem(localStorageKey) == null) {
            cacheImageToLocalStorage(imageUrl, localStorageKey);
        }else{



            // await crud.store(
            //     {
            //         body: {
            //             'path': imageUrl
            //         },
            //         path: path
            //     }
            // ).then((res) => {

            // })
            const base64String = localStorage.getItem(localStorageKey);
            if (base64String) {
                setImage(localStorageKey,base64String)
            }
        }
        

    }
    function setImage(localStorageKey, base64String){
        const imgElement = document.getElementById(localStorageKey);
                imgElement.src = networkImage(localStorageKey);
    }

    function cacheImageToLocalStorage(imageUrl, localStorageKey) {
        imageToBase64(imageUrl, (base64String) => {

            localStorage.setItem(localStorageKey, base64String);
            setImage(localStorageKey, base64String)
        });
    }  


    async function imageToBase64(imageUrl, callback) {

        let base64
        await crud.store(
            {
                body: {
                    'path': imageUrl
                },
                path: path
            }
        ).then((res) => {
            base64 = res.res
            callback(res.res)
        })

        // return base64


    // const xhr = new XMLHttpRequest();
    // xhr.onload = function () {
    //     const reader = new FileReader();
    //     reader.onloadend = function () {
    //     callback(reader.result);
    //     };
    //     reader.readAsDataURL(xhr.response);
    // };
    // xhr.open('GET', imageUrl);
    // xhr.responseType = 'blob';
    // xhr.send();


    // await $fetch(imageUrl, {
    //         method: "GET",
    //     }).then((res)=>{
    //         const reader = new FileReader();
    //         reader.onloadend = function () {
    //         callback(reader.result);
    //         };
    //         reader.readAsDataURL(res);
    //     })

    }


}
})

</script>


<template>

    <img :class="props.customClass" :id="props.image" />

</template>