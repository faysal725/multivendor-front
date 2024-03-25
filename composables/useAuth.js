import { useAuthStore } from '@/stores/authStore';


import {useCrud} from '~~/composables/useCrud';





const getUser = async(authenticated, token, type) => {

  const {apiVersion} = useRuntimeConfig().public;
  const path = apiVersion+'/user';
  const authStore = useAuthStore();
  const crud = useCrud();
  await crud.index({path:path}).then((res)=>{

    authStore.setUser({
      userid:res.res.id,
      authenticated: authenticated,
      token: token,
      username: res.res.name,
      type: type,
      profileimage: res.res.profile_photo_path,
      phone: res.res.phone,
    })
  });
}


export const useAuth = () => {

  
  const {apiVersion} = useRuntimeConfig().public;
  const path = apiVersion+'/user';



  async function registration(body, path) {
    const authStore = useAuthStore();
    
    let response = await networkPost({
      method: "POST",
      body: body,
      heads: {},
      path: apiVersion + path,
    });

    
    if (response.status == 200 && path == `/register` ) {

      authStore.setUser({
        authenticated: true,
        token: response.res.access_token,
        username: "Customer",
        type: "customer",
        profileimage: "",
        phone: "",
      })
      getUser(true, response.res.access_token, "customer")
      navigateTo('/')
    } 
    else if (response.status == 200 && path == `/resend-otp` ) {
        authStore.setUser({
          authenticated: true,
          token: response.res.access_token,
          username: "Customer",
          type: "customer",
          profileimage: "",
          phone: "",
        })
        navigateTo('/')
    }
    
    // else {
    //   toastStore.open('danger' ,'Failed', 'Try Again')
    // }
    return response;
  }

  async function login(body) {
    const authStore = useAuthStore();
    
    let response = await networkPost({
      method: "POST",
      body: body,
      heads: {},
      path: apiVersion + `/login`,
    });
    if (response.status == 200) {
      authStore.setUser({
        authenticated: true,
        token: response.res.access_token,
        username: "Customer",
        type: "customer",
        profileimage: "",
        phone: "",
      })
      getUser(true, response.res.access_token, "customer")
    } else {
      authStore.setUser({
        authenticated: false,
        token: '',
        username: '',
        type: ''
      })
    }
    return response;
  }

  async function logout() {
    const authStore = useAuthStore();

    networkPost({
      method: 'Post',
      path: apiVersion+'/logout',
      heads:{
        Authorization: `Bearer ${authStore.auth.token}`
      },
      body: {}
    })

    authStore.setUser({
      authenticated: false,
      token: '',
      username: '',
      type: ''
    })
  }

  return {
    registration,
    login,
    logout
  }
}
