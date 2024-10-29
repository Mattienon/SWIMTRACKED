<template>
  <v-container class="d-flex justify-center" fluid>
    <div class="form-container">
      <Register />
    </div>
    <div class="form-container mt-5">
      <SignIn />
    </div>
  </v-container>
</template>

<script setup>
import Register from '@/components/Register.vue';
import SignIn from '@/components/SignIn.vue';
</script>

<style lang="scss" scoped>
.v-container {
  padding: 2rem;
}

.form-container {
  background: var(--primary-color); /* Red background for the forms */
  border-radius: 20px; /* Softer edges */
  box-shadow: var(--box-shadow-sharp);
  margin: 1rem;
  width: 100%;
  max-width: 400px; /* Limit the width for a better layout */
  position: relative; /* To position the pseudo-elements */
  overflow: hidden; /* Hide overflow for the pseudo-elements */
}

/* Organic shapes as pseudo-elements */
.form-container::before {
  content: '';
  position: absolute;
  top: -50px; /* Adjust to position above the form */
  left: -50px; /* Adjust to position to the left */
  width: 200px; /* Width of the organic shape */
  height: 200px; /* Height of the organic shape */
  border-radius: 20%; /* Circular shape */
  background: rgba(255, 255, 255, 0.2); /* Light color with transparency */
  z-index: 0; /* Behind the content */
  backdrop-filter: blur(0.2px); 
}

.form-container::after {
  content: '';
  position: absolute;
  bottom: -30px; /* Position below the form */
  right: -30px; /* Position to the right */
  width: 150px; /* Width of the organic shape */
  height: 150px; /* Height of the organic shape */
  border-radius: 10%; /* Circular shape */
  background: rgba(255, 255, 255, 0.2); /* Light color with transparency */
  z-index: 0; /* Behind the content */
  backdrop-filter: blur(0.2px); 
  pointer-events: none;
}

/* Additional styles for responsive design */
@media (max-width: 800px) {
  .v-container {
    flex-direction: column; /* Stack components on smaller screens */
    align-items: center;
  }

  .form-container {
    max-width: 100%; /* Allow full width on smaller screens */
    margin: 1rem 0; /* Add vertical margin */
  }
}
/* Additional styles for responsive design */
@media (max-width: 400px) {
  .v-container {
    flex-direction: column; /* Stack components on smaller screens */
    align-items: center;
    padding: 0;
    margin: 0;
  }

  .form-container {
    padding: 0;
    margin: 0;
    height: 600px;
  }
}

/* Optional: Add a smooth transition */
.form-container {
  transition: all 0.3s ease;
}

.form-container:hover {
  transform: translateY(-5px); /* Lift effect on hover */
}
</style>