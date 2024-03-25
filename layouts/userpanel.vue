<template>
    <main class="grid grid-cols-12 min-h-screen	">


        <section class="col-span-12 transition ease-in-out duration-300 left-0 top-0 fixed w-full z-20"> 
            <PageNavbar/> 
        </section>
        <section class="border-r border-r-secondary-col/50 col-span-2 w-80 left-0 top-20 fixed hidden xl:block">
            <PageLeftSideBar />
        </section>
        <section class=" col-span-12 xl:pl-80">
                <slot />
        </section>
        
    </main>
</template>