<template>
    <v-pagination
      :model-value="currentPage"  
      :length="totalPages"
      class="my-4"
      :total-visible="5"
      @input="updatePage"         
    />
  </template>
  <script setup>
  const props = defineProps({
    currentPage: Number,
    totalPages: Number,
  });
  
  const emit = defineEmits(['update:currentPage']);  // Declare custom event
  
  const updatePage = (newPage) => {
    emit('update:currentPage', newPage);  // Emit event to parent
  };
  </script>