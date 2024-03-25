import { useStorage, useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia';

export const useProductStore = defineStore('productStore', {
  state: () => ({
      
      apiData: {},
      timeOut: ""
  }),
  actions: {
    insertProducts(api, data){
        // console.log(api)
        let productData = []
        // data.map(dt => {
        //   // console.log(dt)
        //   productData.push(dt)
        // })
        this.apiData[api] = data
    },
    emptyApiData(){
        // console.log('running')
    },
    getAllProducts(){
      return this.apiData
    }

  }
})

