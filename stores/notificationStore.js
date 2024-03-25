import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notificationStore', {
  state: () => ({
      show: false,
      type:"",
      message: ""
  }),
  actions: {
    storeNotificationData(msg, type){
      this.message = msg
      this.type = type
    },
    showNotification(){
        this.show = true
        
    },
    hideNotification(){
        this.show = false
    },
    getNotificationState(){
        return this.show
    },
    getNotificationData(){
        return {
          message: this.message,
          type: this.type
        }
    }
  }
})

