<script setup>
import { useAuth } from '@/composables/useAuth'; // Authentication composable
// Get the currentUser from useAuth
const { currentUser } = useAuth();
</script>
<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="user-greeting-card">
          <v-card-text>
            <h4 class="greeting-text">
              Hello, {{ currentUser?.firstName || currentUser?.displayName || 'User' }}!
            </h4>
            <p class="greeting-subtext">Welcome back! We’re glad to see you.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.user-greeting-card {
  background-color: #f0f4ff; /* Light background color */
  padding: 20px; /* Inner padding for the card */
  border-radius: 8px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  text-align: center; /* Center the text */
}

.greeting-text {
  font-size: 1.8rem; /* Default larger font size for the greeting */
  font-weight: 600; /* Bold text */
  color: #333; /* Darker text color for better contrast */
  margin-bottom: 5px; /* Space below the greeting */
}

/* Responsive font sizes */
@media (max-width: 600px) {
  .greeting-text {
    font-size: 1rem; /* Smaller font size on mobile */
  }

  .greeting-subtext {
    font-size: 0.875rem; /* Smaller subtext on mobile */
  }
  .user-greeting-card {
    margin: 0;
    padding: 0;
  }
}

.greeting-subtext {
  font-size: 1rem; /* Default smaller font size for the subtext */
  color: #666; /* Lighter text color for the subtext */
}

/* Add some margin on the sides for larger screens */
@media (min-width: 960px) {
  .user-greeting-card {
    margin: 0 20px; /* Add side margin */
  }
}
</style>