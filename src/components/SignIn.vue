<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <div class="screen">
      <v-card class="login-form" elevation="10">
        <!-- Title -->
        <v-row justify="center">
          <v-col cols="12">
            <h1 class="text-center mb-4 inter-bold">Sign In</h1>
          </v-col>
        </v-row>

        <!-- Username / Email Field -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              outlined
              dense
              placeholder="Email"
              class="login__input"
              hide-details
              :rules="[v => !!v || 'Email is required']"
            >
              <template #prepend>
                <v-icon class="login__icon">mdi-account</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Password Field -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              dense
              placeholder="Password"
              class="login__input"
              hide-details
              type="password"
              :rules="[v => !!v || 'Password is required']"
            >
              <template #prepend>
                <v-icon class="login__icon">mdi-lock</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Error message display -->
        <v-row v-if="errMsg" class="text-danger text-center">
          <v-col cols="12">
            <p class="ubuntu-medium">{{ errMsg }}</p>
          </v-col>
        </v-row>

        <!-- Sign In Button -->
        <v-row justify="center">
          <v-col cols="12">
            <v-btn class="button-30" role="button" block large @click="signIn">
              <p>Sign In</p>
              <v-icon right class="button__icon">mdi-chevron-right</v-icon>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Social Login Section -->
        <v-row class="text-center">
          <v-col cols="12">
            <h3 class="mb-3 ubuntu-regular text-black">Or log in with</h3>
            <v-btn icon class="social-button" @click="signInWithGoogle">
              <v-icon class="social-login__icon">mdi-google</v-icon>
            </v-btn>
            <!-- You can add more social buttons here -->
          </v-col>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth';
const { email, password, errMsg, signIn, signInWithGoogle } = useAuth();
</script>

<style scoped>
/* Screen styling */
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

.v-icon {
  text-align: center;
  font-family: var(--heading-font-family);
  background: linear-gradient(160deg, var(--mediumlight-color), var(--evendarker-color));
  background-clip: text;
  color: transparent;
}

.login-form {
  width: 350px;
  background: linear-gradient(135deg, var(--light-color), var(--accent-color)); /* Smooth gradient */
  backdrop-filter: blur(10px); /* Add a blur effect for glassy background */
  padding: 2rem; /* Add some padding for spacing inside the form */
  box-shadow: var(--box-shadow-6s); /* Use a soft shadow for a smooth, lifted effect */
  border-radius: 10px;
}

/* Optional: Add a subtle hover effect for the form */
.login-form:hover {
  box-shadow: var(--box-shadow-diffuse); /* Initial diffuse shadow */
}

/* Input field styling */
.login__input {
  color: var(--darker-color); /* Darker text color */
}

/* Error message */
.text-danger {
  font-weight: 500;
  margin-top: 10px;
  font-size: 0.9rem;
}

/* Title */
h1 {
  font-size: 2rem;
  color: var(--darker-color); /* Change title color to darker color */
  font-family: var(--heading-font-family);
}

/* Button Styling */
.button-30 {
  align-items: center;
  background-color: #FCFCFD;
  border-radius: 4px;
  border-width: 0;
  box-shadow: rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  height: 35px;
  justify-content: center;
  line-height: 1;
  padding: 10px 16px;
  transition: box-shadow 0.15s, transform 0.15s;
  touch-action: manipulation;
}

.button-30:focus {
  box-shadow: #D6D6E7 0 0 0 1.5px inset, rgba(45, 35, 66, 0.4) 0 2px 4px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
}

.button-30:hover {
  box-shadow: rgba(45, 35, 66, 0.4) 0 4px 8px, rgba(45, 35, 66, 0.3) 0 7px 13px -3px, #D6D6E7 0 -3px 0 inset;
  transform: translateY(-2px);
}

.button-30:active {
  box-shadow: #D6D6E7 0 3px 7px inset;
  transform: translateY(2px);
}

/* Responsive adjustments */
@media screen and (max-width: 400px) {
  .login-form {
    width: 100%; /* Make form full width on smaller screens */
    padding: 1.5rem; /* Adjust padding for smaller devices */
  }

  h1 {
    font-size: 1.8rem; /* Reduce title font size for smaller screens */
  }

  .button-30 {
    padding: 8px 12px; /* Adjust button padding */
    font-size: 0.9rem; /* Reduce button font size */
  }

  .login__input {
    font-size: 0.9rem; /* Smaller input field font size */
  }

  .screen {
    padding: 0 1rem; /* Ensure the form doesn't touch screen edges */
  }
}

@media screen and (max-width: 300px) {
  .login-form {
    width: 100%; /* Full width for very small screens */
    padding: 1rem; /* Less padding on very small screens */
  }

  h1 {
    font-size: 1.6rem; /* Further reduce font size for titles */
  }

  .button-30 {
    padding: 6px 10px; /* More compact button */
    font-size: 0.8rem; /* Further reduce font size */
  }
}
</style>