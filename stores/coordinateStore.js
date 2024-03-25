import { defineStore } from 'pinia';

export const useCoordinateStore = defineStore('coordinateStore', {
  state: () => ({
      takeCoordinate: false,
      data:{
        
          latitude: null,
          longitude: null
      },

  }),
  actions: {
    takeLatLngFormUser(){

        const successCallback = (position) => {
          const {latitude, longitude} = position.coords
        //   location.latitude = latitude
        //   location.longitude = longitude 

            this.takeCoordinate = true
          this.data.latitude =  latitude
          this.data.longitude = longitude

        };
        
        const errorCallback = (error) => {

          this.takeCoordinate = false
          this.data.error= error
            // console.log(error);
        };
        
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    },
    getCoords(){
        return {
            takeCoordinate: this.takeCoordinate,
            data: this.data
        }
    }
  }
})

