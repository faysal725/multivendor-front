<script setup>

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
    data: Object
})
const emit = defineEmits(['update:modelValue'])
onMounted(()=>{
    emitData(props.data.options[0]);
})
const emitData = (option)=>{
    emit('update:modelValue',
        {
            'code':  props.data.id +""+ option.id,
            'string':props.data.name.toString()+": "+option.label.toString()
        }
    )
}
const selected = ref(props.data.options[0])
</script>


<template>
    <Listbox as="div" v-model="selected" class="w-36 pr-5">
            <div class="relative mt-2">
                <ListboxButton class="relative w-full rounded-md bg-white py-1.5 pl-3 cursor-pointer pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col/30  sm:text-sm sm:leading-6">
                <span class="block truncate">{{ selected.label }}</span>
                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
                </ListboxButton>

                <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <ListboxOption as="template" v-for="dt in props.data.options" :key="dt.id" :value="dt" v-slot="{ active, selected }">
                    <li @click="emitData(dt)" :class="[active ? 'bg-indigo-600 text-primary-col cursor-pointer bg-lightGray' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-3 pr-9']">
                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ dt.label }}</span>

                        <span v-if="selected" :class="[active ? 'text-primary-col cursor-pointer' : 'text-indigo-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                    </li>
                    </ListboxOption>
                </ListboxOptions>
                </transition>
            </div>
        </Listbox>
</template>