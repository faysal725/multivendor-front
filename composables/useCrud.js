import { useAuthStore } from '@/stores/authStore';
import {useToastStore} from '~~/stores/toastStore';

export const useCrud = () => {
 
  const { apiVersion } = useRuntimeConfig().public;
  async function get({path}){
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkGet({
      method: 'GET',
      path:path,
      heads:{
          "Accept": "application/json"
      },
    });
    toast({status:response.status,message:response.message})
    return response
  }
  async function index({path}){
    const authStore = useAuthStore();
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkGet({
      method: 'GET',
      path:path,
      heads:{
          Authorization: `Bearer ${authStore.auth.token}`,
          "Accept": "application/json"
      },
    });
    toast({status:response.status,message:response.message})
    return response
  }
  async function show({path}){
    const authStore = useAuthStore();
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkGet({
        method: 'GET',
        path:path,
        heads:{
            Authorization: `Bearer ${authStore.auth.token}`,
            'Accept' : 'application/json'
        },
    });
    toast({status:response.status,message:response.message})
    return response
  }
  async function store({body,path}){
    const authStore = useAuthStore();
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkPost({
          method: 'Post',
          path:path,
          heads:{
              Authorization: `Bearer ${authStore.auth.token}`
          },
          body: body
      });
    toast({status:response.status,message:response.message});
    return response;
  }
  async function update({body,path}){
    const authStore = useAuthStore();
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkPost({
        method: 'PUT',
        path:path,
        heads:{
            Authorization: `Bearer ${authStore.auth.token}`
        },
        body: body
      });

    toast({status:response.status,message:response.message});
    return response;
  }
  async function destroy({path}){
    const authStore = useAuthStore();
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    let response  = await networkGet({
      method: 'DELETE',
      path:path,
      heads:{
          Authorization: `Bearer ${authStore.auth.token}`,
          "Accept": "application/json"
      },
    });
    toast({status:response.status,message:response.message});
    return response;
  }
  
  function toast({status,message}){
    
    const toastStore = useToastStore()
    const {
        open,
        close
    } = toastStore
    if (status === 200) {
      toastStore.open('success' ,'success', message )
    } else if(status === 422){
      toastStore.open('danger' ,'Failed', message )
    }
  }

  return {
    get,
    index,
    show,
    store,
    update,
    destroy
  }
}








































// import { useAuthStore } from '@/stores/authStore';
// import {useToastStore} from '~~/stores/toastStore';

// const authStore = useAuthStore();

// const toastStore = useToastStore()
// const {
//     open,
//     close
// } = toastStore

// export const useCrud = () => {
//   // const { apiVersion } = useRuntimeConfig().public;
//   async function index({path}){
//     let response  = await networkGet({
//       method: 'GET',
//       path:path,
//       heads:{
//           Authorization: `Bearer ${authStore.auth.token}`,
//           "Accept": "application/json"
//       },
//     });
//     toast({status:response.status,message:response.message})
//     return response
//   }
//   async function show({path}){
//     let response  = await networkGet({
//         method: 'GET',
//         path:path,
//         heads:{
//             Authorization: `Bearer ${authStore.auth.token}`,
//             'Accept' : 'application/json'
//         },
//     });
//     toast({status:response.status,message:response.message})
//     return response
//   }
//   async function store({body,path}){
//     let response  = await networkPost({
//           method: 'Post',
//           path:path,
//           heads:{
//               Authorization: `Bearer ${authStore.auth.token}`
//           },
//           body: body
//       });
//     toast({status:response.status,message:response.message});
//     return response;
//   }
//   async function update({body,path}){
//     let response  = await networkPost({
//         method: 'PUT',
//         path:path,
//         heads:{
//             Authorization: `Bearer ${authStore.auth.token}`
//         },
//         body: body
//       });

//     toast({status:response.status,message:response.message});
//     return response;
//   }
//   async function destroy({path}){
//     let response  = networkGet({
//       method: 'DELETE',
//       path:path,
//       heads:{
//           Authorization: `Bearer ${authStore.auth.token}`,
//           "Accept": "application/json"
//       },
//     });
//     toast({status:response.status,message:response.message});
//     return response;
//   }
  
//   function toast({status,message}){
//     if (status === 200) {
//       toastStore.open('success' ,'success', message )
//     } else if(status === 422){
//       toastStore.open('danger' ,'Failed', message )
//     }
//   }

//   return {
//     index,
//     show,
//     store,
//     update,
//     destroy
//   }
// }
