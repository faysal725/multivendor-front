import { $fetch, FetchError } from "ofetch";

export const  networkPost = async({method , path ,heads , body }) => {
    const {backendUrl} = useRuntimeConfig().public;
    var errorMessage = "";
    var response;
    var errors= [];
    let flag = 200;
    await $fetch(path, {
        method: method,
        baseURL: backendUrl,
        headers: heads,
        body:body
    }).then((res)=>{
        response = res;
    }).catch((error)=>{
        console.log(error);
        flag = 422;
        errorMessage = error.response._data.message;
        errors = error.response._data.errors;
    });
    if(flag == 422){
        return {
            'status' : 422,
            'errors': errors,
            'message': errorMessage,
        }
    }else{
        return {
            'status' : 200,
            'res': response,
            'message': "Network Responded Successfully",
        }
    }
}
export const  networkGet = async({method , path ,heads }) => {
    const {backendUrl} = useRuntimeConfig().public;
    var errorMessage = "Error Internal";
    var response;
    var errors= [];
    let flag = 200;
    await $fetch(path, {
        method: method,
        baseURL: backendUrl,
        headers: heads,
        
    }).then((res)=>{
        response = res;
    }).catch((error)=>{
        flag = 422;
        errors = error;
    });
    if(flag == 422){
        return {
            'status' : 422,
            'errors': errors,
            'message': errorMessage,
        }
    }else{
        return {
            'status' : 200,
            'res': response,
            'message': "Network Responded Successfully",
        }
    }
}

export const  networkImage = (imagePath)=>{
    const {backendUrl} = useRuntimeConfig().public;
    return backendUrl+'/storage/'+imagePath;
}
