<script setup>
import { ChevronRightIcon,XMarkIcon } from '@heroicons/vue/24/outline';
 const props = defineProps(
   {
      modelValue : [String,Number,Boolean] ,
      title  : String ,
      label : String ,
      type  : String ,
      error : String ,
      oldValue :  [String, Number , Boolean ] ,
      options : Array
 
   }
 )
  let errorMsg = ref('')
  let selectedItems = ref([])

  const emit = defineEmits(['update:modelValue'])
  
  let openDropdown = ref(false)
  let setInput = ref("")
  let availableOptions = ref(props.options)
  
  // entering old value inside it 
  if (props.oldValue !== null) {
     props.options.map((av, index) => {
      if (av.key == props.oldValue) {
        setInput.value = av.value
        emit('update:modelValue', av.key)
      }
    })
    
  }




function searchWords(event) {
  let inputString = event.target.value
  let words = props.options
  if (inputString.length ===0) {
    availableOptions.value  = words
  } else {
    for (var i = 0; i < words.length; i++) {
    if (words[i].value === inputString) {
    // return words[i];
      
      availableOptions.value = [words[i]]
    }
  }
  }

  // return null;
}

function selected(key ,value) {
    setInput.value = value
    openDropdown.value = false
    let keys = []
    let isItemEntered = selectedItems.value.find(dt => dt.key === key)
    
    if(!isItemEntered){
      selectedItems.value.push({key: key, value: value})
      selectedItems.value.map(dt => keys.push(dt.key))
      emit('update:modelValue', keys)
    }
    

  }
  
  
function removeVariation(dt, index) {
  let keys = []
  selectedItems.value.splice( index,1)
  selectedItems.value.map(dt => keys.push(dt.key))
  emit('update:modelValue', keys)
  openDropdown.value = false
}

  
  watch(
	() => props.error,
	() => {
    
    errorMsg.value = props.error
	},
	{deep: true}
)
</script>

<template>
    <main class="rounded-md px-3 pt-2.5 pb-1.5 h-14 w-full	 shadow-sm ring-1 ring-inset ring-darkGray/50 focus-within:ring-1 focus-within:ring-skyBlue relative group">
      <label :for="props.label" class="block text-xs  text-darkGray/70 group-focus-within:text-skyBlue">{{ props.title }}</label>

      <ul class="flex gap-3 w-full border-0 p-0 text-darkGray bg-transparent placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6" @click="!openDropdown ? openDropdown  = true : openDropdown = false" >
        <li v-for="dt ,index in selectedItems" :key="dt.key" class="flex items-center gap-2 rounded bg-skyBlue w-fit px-2 text-white font-medium ">
            <span>{{dt.value}}</span>
            <XMarkIcon  class=" h-5" @click="removeVariation(dt, index)"/>
        </li>
      </ul>


      <ChevronRightIcon class="h-5 absolute top-5 right-4 transition-all duration-150" :class="openDropdown ? 'rotate-90' : 'rotate-0'" @click="!openDropdown ? openDropdown  = true : openDropdown = false"/>
      <ul 
      v-show="openDropdown"
      class="absolute z-10 flex flex-col gap-2 bg-white w-full left-0 top-16 border rounded border-darkGray/50 divide-y divide-darkGray/50 p-2 transition-all duration-150 ">
          <li>
              <input type="text" @input="searchWords" class="block w-full border-0 p-0 px-3 py-1 text-darkGray bg-darkGray/5  placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6 " placeholder="search...">
          </li>
          <li @click="selected('', '')" 
          class="hover:bg-dashboardBG p-1.5"
          >
             <p class="text-darkGray/70 text-sm">Reset</p>
          </li>
          <li v-for="item in availableOptions" :key="item" @click="selected(item.key,item.value)" 
          class="hover:bg-skyBlue/30"
          >
             <p class="text-darkGray/70 text-sm">{{ item.value }}</p>
          </li>
      </ul> 

      <span class="text-xs font-light text-warningRed absolute left-0 -bottom-5">{{ errorMsg }}</span>
    </main>
</template>
