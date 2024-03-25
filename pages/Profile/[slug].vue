<script setup>
setPageLayout('user')

const rightSidebarData = [
    {id:0, name: 'Accout Info'},
    {id:1, name: 'Order History'},
    {id:2, name: 'Payment Method'},
    {id:3, name: 'Return'},
]
</script>


<template>
    <div class="grid grid-cols-12 bg-white px-4 mx-auto pt-40 ">
        <!-- <div class="bg-secondary-col col-span-4 flex"> -->
            <!-- right side bar  -->
            <!-- <ul v-for="data in rightSidebarData" :key="data.id" >
                <li>{{ data.name }}</li>
            </ul> -->
            <!-- <PageSidebar :rightSidebar="true" :data="rightSidebarData"/>
        </div>
        <div class="col-span-8 bg-red">sdf</div> -->
        <h1>Profile</h1>
    </div>
</template>