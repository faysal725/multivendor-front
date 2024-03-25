<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <form class="space-y-8 max-w-7xl">
    <div class="space-y-8 sm:space-y-5">
      <div class="space-y-6 pt-8 sm:space-y-5 sm:pt-10">
        <div class="space-y-6 sm:space-y-5">
          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="title"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Product Title *</label
            >

            <input
              type="text"
              name="title"
              id="title"
              autocomplete="given-name"
              class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Max 80 Characters"
            />
          </div>

          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="title"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Keywords</label
            >

            <input
              type="text"
              name="title"
              id="title"
              autocomplete="given-name"
              class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Type Keyword for better search results"
            />
          </div>

          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="category"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Select Category *</label
            >

            <select
              id="category"
              name="category"
              autocomplete="category"
              class="bg-secondary-col/20 block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>Select a category</option>
              <option>Men</option>
              <option>Women</option>
            </select>
          </div>

          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="variations"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Variations *</label
            >

            <select
              id="variations"
              name="variations"
              autocomplete="variations"
              class="bg-secondary-col/20 block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="sku"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >SKU *</label
            >

            <input
              type="text"
              name="sku"
              id="sku"
              class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Max 80 Characters"
            />
          </div>

          <div class="flex flex-col sm:items-start sm:gap-2 sm:pt-5">
            <label
              for="description"
              class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >Product description
            </label>

            <textarea
              id="description"
              name="description"
              rows="3"
              class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>

          <div class="flex justify-between gap-20">
            <div class="flex flex-col grow sm:items-start sm:gap-2 sm:pt-5">
              <label
                for="brand"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Brand</label
              >

              <input
                type="text"
                name="brand"
                id="brand"
                autocomplete="given-name"
                class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Brand name"
              />
            </div>

            <div class="flex grow flex-col sm:items-start sm:gap-2 sm:pt-5">
              <label
                for="warranty"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Warranty Informtion</label
              >

              <input
                type="text"
                name="warranty"
                id="warranty"
                autocomplete="given-name"
                class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Warranty Informstion"
              />
            </div>
          </div>

          <div class="flex justify-between gap-20">
            <div class="flex flex-col grow sm:items-start sm:gap-2 sm:pt-5">
              <label
                for="weight"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Package Weight (KG)</label
              >

              <input
                type="text"
                name="weight"
                id="weight"
                autocomplete="given-name"
                class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Brand name"
              />
            </div>

            <div class="flex justify-between grow gap-3 sm:pt-5">
              <div class="flex flex-col grow sm:items-start sm:gap-2 ">
                <label
                  for="length"
                  class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >Length</label
                >

                <input
                  type="text"
                  name="length"
                  id="length"
                  autocomplete="given-name"
                  class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div class="flex flex-col grow sm:items-start sm:gap-2 ">
                <label
                  for="width"
                  class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >Width</label
                >

                <input
                  type="text"
                  name="width"
                  id="width"
                  class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div class="flex flex-col grow sm:items-start sm:gap-2 ">
                <label
                  for="height"
                  class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                  >Height</label
                >

                <input
                  type="text"
                  name="height"
                  id="height"
                  autocomplete="given-name"
                  class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-secondary-col placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

            </div>
          </div>

          <div class="flex justify-between gap-20">
            <div class="flex flex-col grow sm:items-start sm:gap-2 sm:pt-5">
              <label
                for="price"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Price</label
              >

              <input
                type="text"
                name="price"
                id="price"
                autocomplete="given-name"
                class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter Product Selling Price"
              />
            </div>

            <div class="flex grow flex-col sm:items-start sm:gap-2 sm:pt-5">
              <label
                for="quantity"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Quantity</label
              >

              <input
                type="text"
                name="quantity"
                id="quantity"
                autocomplete="given-name"
                class="bg-lightGray block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Enter number of quantity"
              />
            </div>
          </div>

          <div class="">

            <label
                for="price"
                class="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
                >Uploaded product photos (5 MB Max) *
            </label>
            <div class="flex gap-4 flex-wrap my-5">
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
                
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
                
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
                
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
                
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
                
                <img class="h-24" src="../../../assets/images/merchantImg/uploadedImg.png" alt="">
            </div>
          </div>

          <div class="flex justify-end gap-x-3">
            <div class="w-fit">
                <button class="bg-black p-2 px-10 text-white font-medium rounded">Submit</button>
            </div>
          </div>

          
        </div>
      </div>


    </div>
<!-- 
    <div class="pt-5">
      <div class="flex justify-end gap-x-3">
        <button
          type="button"
          class="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </div> -->
  </form>
</template>
