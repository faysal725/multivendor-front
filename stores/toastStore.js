import { defineStore } from 'pinia';

export const useToastStore = defineStore('toastStore', {
  state: () => ({
      shouldOpen: false,
      type:"",
      message:"",
      title:""
  }),
  actions: {
    open(type, title, msg){
        this.shouldOpen = true
        this.type = type
        this.message = msg
        this.title = title
    },
    close(){
        this.shouldOpen =  false
        this.type = "",
        this.message = "",
        this.title = ""
    },
    getState(){
        return this.shouldOpen
    },
    getInfo(){
        return {
            type: this.type,
            message: this.message,
            title: this.title
        }
    }
  }
})

