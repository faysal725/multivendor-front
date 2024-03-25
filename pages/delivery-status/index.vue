<script setup >
import { GoogleMap, Marker } from "vue3-google-map";



const center = { lat: 23.754491313449115, lng: 90.38906184560385 };
const markerOptions = { position: center, label: "L", title: "LADY LIBERTY", draggable : true };


// window.Pusher = Pusher;
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'adnan',
//     cluster: 'mt1',
//     forceTLS: false
// });
onMounted(()=>{
    if (process.client) {

       
      window.Echo.channel('adnan').listen('AlertEvent',(e)=>{

      })
      window.Echo.channel.bind('pusher:subscription_succeeded', function(members) {
            alert('successfully subscribed!');
        });
      
    }
})
// onMounted(()=>{
//     const pusher = new Pusher("adnan", {
//     cluster: "mt1",
//     channelAuthorization: {
//         endpoint: 'http://127.0.0.1:8000'
//     },
//     });
//     const echo = new Echo({
//         broadcaster: 'pusher',
//         key: "adnan",
//         cluster: "mt1",
//         forceTLS: true,
      
//       authEndpoint: "http://127.0.0.1:8000/api/test",
//         // auth: {
//         //   headers: {
//         //     Authorization: 'Bearer ' + this.$auth.token(),
//         //     Accept: 'application/json',
//         //   }
//         // },
//       });

//     echo.private('adnan').listen('NewAlert',(e) => {
//         // this.handleIncoming(e.message);

//         this.$swal({
//           toast: true,
//           position: 'top-end',
//           showConfirmButton: false,
//           timer: 10000,
//           icon: 'success',
//           text: 'New shipping available! ' + e.shipment.shippingId,
//         })
//       });
// })


function placedMark(event){

}
</script>

<template>
    <div class="flex justify-center">
        <div class="w-2/4">
            <GoogleMap
            draggable="true" 
            api-key="AIzaSyAxPHXcoWF4H-g-8kivUn8FlF2uyvqHZqs" style="width: 100%; height: 500px" :center="center" :zoom="20"
            @click="placedMark" 
            >
                <Marker :options="markerOptions" />
            </GoogleMap>
        </div>
    </div>

</template>
