import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
export default defineNuxtPlugin(nuxtApp =>{
    // console.log("echo");
    if (process.client) {
    window.Pusher = Pusher;
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: 'myappkey', 
        // wsHost: 'localhost',
        // wsHost: 'api.meds.digimountltd.com',
        wsHost: 'api.shopelo.com.bd',
        wsPort: 6001,
        wssPort: 6001,
        disableStats: true,
        encrypted: true,
        cluster: 'mt1',
        forceTLS: false
        
    });
    // console.log("window.Echo");
    // console.log(window.Echo);
    }
    
});