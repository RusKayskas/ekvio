<template>
  <main>
    <div class="container">
      <!-- <UiButton /> -->
      <UiFileInput @file-uploaded="handleFileUploaded" />
    </div>
  </main>
</template>
<script setup lang="ts">

import UiFileInput from '@/components/Ui/UiFileInput.vue';
const handleFileUploaded = (file: File) => {
  console.log('File uploaded:', file);
};
</script>
<style lang="scss"></style>