import { useStorage, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia';

export const useDonationStore = defineStore('donationStore', {
  state: () => ({
    takeCoordinate: false,
    data:{
        address: useStorage('location.address', null),
        houseNo:useStorage('location.houseNo', null),
        floorNo:useStorage('location.floorNo', null),
        lat: useStorage('location.lat', null),
        lng: useStorage('location.lng', null),
    },

  }),
  actions: {

    getPatientAddress(){
        return this.data
    },
    getPatientCoordinate(){
      return this.takeCoordinate
    },
    // clearState(){
    //   this.data.address = ""
    //   this.data.houseNo = ""
    //   this.data.floorNo = ""
    //   this.data.lat = "" 
    //   this.data.lng = "" 
    // },
    // setAddress(info){
    //     this.data.address = info.add
    //     this.data.houseNo = info.houseNo
    //     this.data.floorNo = info.floorNo
    //     this.data.lat = info.lat 
    //     this.data.lng = info.lng 


    // },

    setPatientAddress({add, houseNo, floorNo, lat, lng}){
      this.data.address = add
      this.data.houseNo = houseNo
      this.data.floorNo = floorNo
      this.data.lat = lat 
      this.data.lng = lng 
    },


    takeCurrentLatLng(){

      const successCallback = (position) => {
        const {latitude, longitude} = position.coords
      //   location.latitude = latitude
      //   location.longitude = longitude 

        this.takeCoordinate = true
        this.data.address = "Current Location"
        this.data.houseNo = ""
        this.data.floorNo = ""
        this.data.lat =  latitude
        this.data.lng = longitude

      };
      
      const errorCallback = (error) => {

        this.takeCoordinate = false
        this.data.error= error

      };
      
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    },
    clearCoords(){
      this.data.address = ""
      this.data.houseNo = ""
      this.data.floorNo = ""
      this.data.lat = "" 
      this.data.lng = "" 
    },
    getUserCoords(){
        return {
            takeCoordinate: this.takeCoordinate,
            data: this.data
        }
    },
    loadCoords(bool){
      this.takeCoordinate = bool
    }
  }
})


