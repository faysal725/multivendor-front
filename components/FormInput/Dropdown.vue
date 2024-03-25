<script setup>
import { ChevronRightIcon } from '@heroicons/vue/24/outline';
import useDetectOutsideClick from '../../composables/useInput'


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

 const componentRef = ref()

  useDetectOutsideClick(componentRef, () => { 
    openDropdown.value = false
  })


  let errorMsg = ref('')
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
  // Convert searchWords to lowercase for case-insensitive matching
  const lowercaseSearchWords = event.target.value.toLowerCase();
  let items =  props.options

// Initialize variables for tracking the maximum match count and the most matched word
let maxMatchCount = 0;
let mostMatchedWords = [] ;

// Iterate through each object in the items array
for (let i = 0; i < items.length; i++) {
const item = items[i];

// Convert the value property to lowercase for case-insensitive matching
const lowercaseValue = item.value.toLowerCase();

// Count the number of matches between searchWords and lowercaseValue
let matchCount = 0;
for (let j = 0; j < lowercaseValue.length; j++) {
if (lowercaseValue.includes(lowercaseSearchWords[j])) {
matchCount++;
}
}

// Update maxMatchCount and mostMatchedWord if a higher match count is found
if (matchCount > maxMatchCount) {
maxMatchCount = matchCount;
mostMatchedWords = [item.value];
}
else if (matchCount === maxMatchCount) {
  // If multiple words have the same highest match count, add them to the mostMatchedWords array
  mostMatchedWords.push(item.value);
}
}
let finalSearchdWords = []
mostMatchedWords.map((dt) =>
items.map((it) =>  {
  it.value.toLowerCase() == dt.toLowerCase() ? finalSearchdWords.push(it) : finalSearchdWords
}))
availableOptions.value = finalSearchdWords
}


function selected(key ,value) {
    setInput.value = value
    openDropdown.value = false
    emit('update:modelValue', key)
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
    <main ref="componentRef" class="rounded-md px-3 pt-2.5 pb-1.5 h-14 w-full	 shadow-sm ring-1 ring-inset ring-darkGray/50 focus-within:ring-1 focus-within:ring-skyBlue relative group">
      
      <div @click="!openDropdown ? openDropdown  = true : openDropdown = false" class="cursor-pointer">
        <label :for="props.label" class="block text-xs cursor-pointer text-darkGray/70 group-focus-within:text-skyBlue">{{ props.title }}</label>

        <input type="text" :name="props.label" :id="props.label"  class="cursor-pointer block w-full border-0 p-0 text-darkGray bg-transparent placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6" @click="!openDropdown ? openDropdown  = true : openDropdown = false"   :value="setInput" disabled/>
        <div class="absolute bottom-0 h-full w-full z-10"></div>


        <ChevronRightIcon class="h-5 absolute top-5 right-4 transition-all duration-150" :class="openDropdown ? 'rotate-90' : 'rotate-0'"/>
      </div>

      <ul 
      v-show="openDropdown"
      class="absolute z-10 flex flex-col gap-2 bg-white w-full left-0 top-16 border rounded border-darkGray/50 divide-y divide-darkGray/50 p-2 transition-all duration-150 ">
          <li>
              <input type="text" @input="searchWords" class="block w-full border-0 p-0 px-3 py-1 text-darkGray bg-darkGray/5  placeholder:text-gray-400 focus:ring-0 focus:outline-none sm:text-sm sm:leading-6 " placeholder="search...">
          </li>
          <li @click="selected('', '')" 
          class="hover:bg-skyBlue/30 p-2"
          >
             <p class="text-darkGray/70 text-sm">Select</p>
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
