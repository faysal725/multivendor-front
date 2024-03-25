<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon, ExclamationCircleIcon,  ChatBubbleLeftIcon} from '@heroicons/vue/20/solid'

import {useNotificationStore} from '~~/stores/notificationStore';


const show = ref(true)

const notificationStore = useNotificationStore()
const {
    showNotification,
    hideNotification,
    getNotificationState,
    getNotificationData
} = notificationStore


watch(
	() => notificationStore.getNotificationState(),
	() => {
        if (notificationStore.getNotificationState() == true) {
            setTimeout(() => {
                notificationStore.hideNotification()
            }, 2000)
        }
	},
	{deep: true}
)

</script>

<template>
    <div class="p-5 py-3 flex items-start gap-2 max-w-xl border-4 border-black/10 border-r-0 rounded-tl-lg rounded-bl-lg bg-white">
        <div class="pt-1">
            <ExclamationCircleIcon v-if="notificationStore.getNotificationData().type == 'alert'" class="h-5 w-full text-warningRed" /> 
            <!-- {{ notificationStore.getNotificationData().type == 'msg' }} -->
            <ChatBubbleLeftIcon v-if="notificationStore.getNotificationData().type == 'msg'" class="h-5 w-full text-mediumBlue" /> 
        </div>

        <div class="flex flex-col gap-y-2">
            <p v-if="notificationStore.getNotificationData().type == 'alert'" class="text-xl font-medium text-warningRed">Alert !!!</p>
            <p v-if="notificationStore.getNotificationData().type == 'msg'" class="text-xl font-medium text-mediumBlue">Success</p>
            <p class="text-sm font-normal text-lightBlack">{{ notificationStore.getNotificationData().message }}</p>
        </div>
    </div>
  </template>