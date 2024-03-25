<template>
    <div class="px-4 sm:px-6 lg:px-8">
      
      <div class=" flow-root">
        <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Qty</th>
                  <!-- <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3">
                    <span class="sr-only">Edit</span>
                  </th> -->
                </tr>
              </thead>
              <tbody class="bg-secondary-col/10">
                <tr v-for="(person, personIdx) in people" :key="person.email" :class="personIdx % 2 === 0 ? undefined : 'bg-gray-50'">
                  <td class="whitespace-nowrap flex items-center gap-2 py-4 pl-4 pr-3 text-sm font-medium text-darkGray sm:pl-3">
                    <img src="../../../assets/images/ProductDetails/prdImg.png" alt="" class="h-10">    
                    {{ person.name }}
                </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.status }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ person.category }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    
                    <div class="flex items-center gap-2">
                        <p class="font-medium">Qty8</p>
                        <PageMerchantDropdown />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const people = [
    { name: 'Black Owl T shirt for Men', status: 'Published', category: 'Men', qty: 'Member' },
    { name: 'Black Owl T shirt for Men', status: 'Published', category: 'Men', qty: 'Member' },
    { name: 'Black Owl T shirt for Men', status: 'Published', category: 'Men', qty: 'Member' },
    { name: 'Black Owl T shirt for Men', status: 'Published', category: 'Men', qty: 'Member' },

  ]
  </script>