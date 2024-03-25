import { defineStore } from 'pinia';
export const useAuthStore = defineStore('authStore', {
  persist: true,
  state: () => { 
    return {
       auth: {
         authenticated:  false,
         userid:  null,
         token:  null,
         username:  null,
         type:  null,
         profileImage:  null,
         phone:  null,
       },
    }
  },
  actions: {
    setUser({ userid, authenticated, token, username, type, profileimage, phone}) {
      this.auth.userid = userid;
      this.auth.authenticated = authenticated;
      this.auth.token = token;
      this.auth.username = username;
      this.auth.type = type;
      this.auth.profileImage = profileimage;
      this.auth.phone = phone
    
    },
    getUser(){
      return this.auth
    }
  }
})
