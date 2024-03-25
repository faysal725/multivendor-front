
import {useProductStore} from '@/stores/productStore';
import {useAddressStore} from '@/stores/userAddressStore';
import {useCartStore } from '@/stores/cartStore';





export const productStoreChecker = (path, callback) => {
  const productStore = useProductStore()
  const {

    insertProducts,
    emptyApiData,
    getAllProducts
  } = productStore
  let data 
  if (productStore.getAllProducts()[path]) {
    
    data = productStore.getAllProducts()[path]
    return data
  } else{
    return callback()
  }

  // callback()
}

export const getFirstWordInSlash = (url) => {
  const productStore = useProductStore()
  const {

    insertProducts,
    emptyApiData,
    getAllProducts
  } = productStore
    const pathSegments = url.split('/'); // Split the URL by slashes
  
    // Find the first non-empty segment that contains a word
    const firstSegmentWithWord = pathSegments.find(segment => segment.trim().length > 0 && /\w+/.test(segment));
  
    if (!firstSegmentWithWord) return null; // No segment found
  
    // Find the first word inside the segment
    const firstWordInSegment = firstSegmentWithWord.match(/\w+/)[0];
  
    return firstWordInSegment; // Return the first word inside the segment
}

export const getGeolocation = async () => {

  let location = {
    latitude: null,
    longitude: null,
    error: null
  }
  
  const successCallback = async (position) => {
    // console.log(position.coords);
    const {latitude, longitude} = position.coords
    location.latitude = latitude
    location.longitude = longitude 
  };
  
  const errorCallback = (error) => {

    location.error = error
  };

 await navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

 return location
}

export const stringShortner = (word, limit) =>{
let shortWord
 if( word.length > 17){
  shortWord = word.substring(0, limit) + "...."
 }else{
  shortWord = word
 }

 return shortWord
}


export const hyphenRemover = (inputString) => {
  // Use the replace() method with a regular expression to remove hyphens and add white spaces
  return inputString.replace(/-/g, ' ');
}

export const calculateDeliveyCharge = async({data , quantity , deduct = false} ) => {
    const {apiVersion} = useRuntimeConfig().public;
    var vendor = data.vendor;
    if(useCartStore().getProducts().length == 0){
      await networkGet({
        method : 'GET',
        heads : {
          'accept': 'application/json',
        },
        path : apiVersion+'/delivery-charge-setting'               
      }).then(async(response) =>{
          console.log('per kg charge', response.res.base_fare)
          // console.log('per km charge', response.res.per_km)
          useCartStore().setWeightCharge(response.res.per_kg);
          useCartStore().setkmCharge(response.res.per_km);
          useCartStore().setBaseFare(response.res.base_fare);
          var  destination = useAddressStore().getAddress().lat +","+useAddressStore().getAddress().lng;
          var origin = vendor.latitude +"," + vendor.longitude
          await networkGet({
            method : 'GET',
            heads : {
              'accept': 'application/json',
            },
            path : apiVersion+'/calculate-distance?origin='+origin+'&destination='+destination                
          }).then(response =>{
            console.log('distance between user and vendor', response.res)
            // console.log('product total weight', data.weight * quantity)

              var charge = useCartStore().getBaseFare()+(response.res * useCartStore().getKmCharge() + (data.weight * quantity) * useCartStore().getWeightCharge());

              var chargeRef = `basefare:${useCartStore().getBaseFare()}, KM:${response.res}, kmcharge: ${useCartStore().getKmCharge()}, weight:${data.weight}, quantity:${quantity} , weightCharge:${useCartStore().getWeightCharge()};`
              
              useCartStore().setDeliveryCharge(charge);
              useCartStore().setChargeReference(chargeRef);
          })
      })
      
    }else{
        if(deduct){
          var charge = useCartStore().getDeliveryCharge() - (data.weight * quantity) * useCartStore().getWeightCharge();
          useCartStore().setDeliveryCharge(charge); 
        }else{
        var charge = useCartStore().getDeliveryCharge() + (data.weight * quantity) * useCartStore().getWeightCharge();
        useCartStore().setDeliveryCharge(charge); 
        }
        
    }
    
}
export const drivewayDistance = async(lat, lng) => {
  const {apiVersion} = useRuntimeConfig().public;
  var  destination = useAddressStore().getAddress().lat +","+useAddressStore().getAddress().lng;
  var origin = lat +"," + lng
  return await networkGet({
    method : 'GET',
    heads : {
      'accept': 'application/json',
    },
    path : apiVersion+'/calculate-distance?origin='+origin+'&destination='+destination                
  })
}








// export const dateFormatConverter = (originalDateString) => {
//   // const originalDateString = "Sun Sep 03 2023 16:37:58 GMT+0600 (Bangladesh Standard Time)";
//   const originalDate = new Date(originalDateString);

//   const year = originalDate.getFullYear();
//   const month = String(originalDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-indexed
//   const day = String(originalDate.getDate()).padStart(2, '0');
//   const hours = String(originalDate.getHours()).padStart(2, '0');
//   const minutes = String(originalDate.getMinutes()).padStart(2, '0');
//   const seconds = String(originalDate.getSeconds()).padStart(2, '0');

//   const formattedDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//   // console.log(formattedDateString);
//   return formattedDateString;
// }

// export const getTimeDifference = (dateString1, dateString2) => {
//   const date1 = new Date(dateString1);
//   const date2 = new Date(dateString2);

//   if (isNaN(date1) || isNaN(date2)) {
//     throw new Error("Invalid date strings");
//   }

//   const timeDifferenceMillis = Math.abs(date1 - date2);
//   const hours = Math.floor(timeDifferenceMillis / 3600000);
//   const minutes = Math.floor((timeDifferenceMillis % 3600000) / 60000);
//   const seconds = Math.floor((timeDifferenceMillis % 60000) / 1000);

//   return { hours, minutes, seconds };
// }


export const IsoToLocal = (timeString) => {
  const isoDate = new Date(timeString);

  // Get the local date and time strings
  const localDateString = isoDate.toLocaleDateString();
  const localTimeString = isoDate.toLocaleTimeString();
  return { localDateString, localTimeString };
};