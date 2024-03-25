<script setup>
definePageMeta({
  layout: "userpanel",
  middleware: ["auth"],
});
</script>

<template>
  <div>
    <div class="w-full h-full">
      <ButtonWhatsApp :number="0" />
    </div>
  </div>
</template>
