import { defineStore } from 'pinia';
import {useNotificationStore} from '@/stores/notificationStore'
import { calculateDeliveyCharge } from '@/composables/utils';




export const useCartStore = defineStore('cartStore', {
//   persist: true,
  state: () => ({
      shouldOpen: false,
      products: [],
      vendorId: null,
      subTotal: 0,
      total : 0,
      youSaved: 0,
      deliveryCharge: 0,
      kmCharge: 0,
      weightCharge: 0,
      baseFare: 0,
      chargeReference: "",
  }),
  actions: {
    open(type, title, msg){
        this.shouldOpen = true
    },
    close(){
        this.shouldOpen =  false
    },
    getState(){
        return this.shouldOpen
    },
    setProduct(product){
        // console.log(product.product)
        this.vendorId = product.product.vendor_id
        const {multipleShop} = useRuntimeConfig().public;
        const notificationStore = useNotificationStore()
        const {
        showNotification,
        hideNotification,
        getNotificationState,
        getNotificationData,
        storeNotificationData
        } = notificationStore
        if(this.products.length > 0){
            if (
                multipleShop == 'false' && 
                product.product.vendor_id == this.products[0].vendor_id
            ) {
                calculateDeliveyCharge({data: product.product , quantity :  product.quantity});
                let exists = this.products.find((item)=>{ 
                    if(item.code == product.code){
                        console.log(typeof item.quantity, typeof Number(product.quantity))
                        item.quantity = Number(item.quantity) + Number(product.quantity)
                    }
                    return item.code == product.code;
                    
                });
                if(exists == undefined ){
                    this.products.push(productBody(product));
                }
            } 
            else{
                notificationStore.storeNotificationData("Products from different shop cannot be added", 'alert')
                notificationStore.showNotification()
            }

            
        }else{
            calculateDeliveyCharge({data: product.product , quantity :  product.quantity});
            this.products.push(productBody(product))
        }
        // this.$store.forceRehydrate();

        localStorage.setItem("cart",JSON.stringify(this.products));
    },
    removeProduct(index){
        calculateDeliveyCharge({data: this.products[index].raw.product , quantity : this.products[index].quantity  , deduct : true});
        this.products.splice(index, 1);
        this.checkCartStatus()
        this.setSubTotal()
        localStorage.setItem("cart",JSON.stringify(this.products));
    },
    emptyCart(){
        this.vendorId = null
        this.deliveryCharge = 0;
        this.kmCharge = 0
        this.weightCharge = 0
        this.baseFare = 0
        this.subTotal = 0;
        this.total =0;
        this.products.splice(0,this.products.length)
        localStorage.setItem("cart",JSON.stringify(this.products));
    },
    getProducts(){
        return this.products;
    },
    setProducts(products){
        return this.products = products ;
    },
    setChargeReference(crgRef){
        this.chargeReference = crgRef
    },
    getChargeReference(){
        return this.chargeReference 
    },
    setBaseFare(baseFare){
        this.baseFare = baseFare
    },
    getBaseFare(){
        return Math.ceil(this.baseFare)
    },
    setDeliveryCharge(deliveryCharge){
        this.deliveryCharge = deliveryCharge
    },
    getDeliveryCharge(){
        return Math.ceil(this.deliveryCharge)
    },
    getVendorId(){
        return this.vendorId
    },
    setWeightCharge(weightCharge){
        this.weightCharge = weightCharge
    },
    setkmCharge(kmCharge){
        this.kmCharge = kmCharge
    },
    getWeightCharge(){
        return this.weightCharge
    },
    getKmCharge(){
        return this.kmCharge
    },
    checkCartStatus(){
        if(this.products.length == 0){
            this.deliveryCharge =0;
            this.subTotal = 0;
        }
    },
    getTotal(){
        return Math.ceil(this.subTotal + this.deliveryCharge)
    },
    setSubTotal(){
        this.subTotal = 0
        this.products.map((dt) => {
        this.subTotal += dt.quantity * dt.discountedPrice
        })
    },
    getSubTotal(){
        return Math.ceil(this.subTotal)
    }

  }
})
const productBody = (product)=>{
    // console.log(product);
    if(product.product.has_variation){
        var discountedPrice = product.product.variations.map((dt)=>{
                                    if(dt.variation_code == product.code){
                                        return dt.discounted_price;
                                    }else{
                                        ''
                                    }
                                }).join('')
        // console.log('discountedPrice set', discountedPrice);
        var price = product.product.variations.map((dt)=>{
                          if(dt.variation_code == product.code){
                              return dt.price;
                          }else{
                              ''
                          }
                      }).join('')
        return {
            'product_id': product.product.id,
            'vendor_id': product.product.vendor_id,
            'has_variation': 'true',
            'variationRaw': product.variationRaw,
            'raw': product,
            'name': product.product.name,
            'image' : networkImage(product.product.thumbnail_path),
            'quantity': product.quantity,
            'code': product.code,
            'variation': product.variationString,
            'price':  price,
            'discountedPrice': discountedPrice == '' ? price : discountedPrice,
          }
    }else{
        
        return {
            'product_id': product.product.id,
            'vendor_id': product.product.vendor_id,
            'has_variation': 'false',
            'variationRaw': '',
            'raw': product,
            'name': product.product.name,
            'image' : networkImage(product.product.thumbnail_path),
            'quantity': product.quantity,
            'code': product.code,
            'variation': '',
            'price':  product.product.price,
            'discountedPrice': product.product.discounted_price == null ? product.product.price : product.product.discounted_price
          }
    }
}

