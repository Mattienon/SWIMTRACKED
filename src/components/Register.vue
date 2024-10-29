<template>
  <v-container class="d-flex justify-center align-center fill-height" fluid>
    <div class="screen">
      <v-card class="shadow-lg p-5 register-form" elevation="10">
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <h1 class="form-title text-center mb-4 inter-bold">Create Account</h1>
          </v-col>
        </v-row>

        <!-- First Name Field -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="firstName"
              outlined
              dense
              placeholder="First Name"
              class="register__input"
              hide-details
              :rules="[v => !!v || 'First name is required']"
            >
              <template #prepend>
                <v-icon class="register__icon">mdi-account</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Email Field -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              outlined
              dense
              placeholder="Email"
              class="register__input"
              hide-details
              type="email"
              :rules="[v => /.+@.+\..+/.test(v) || 'Email must be valid']"
            >
              <template #prepend>
                <v-icon class="register__icon">mdi-email</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Password Field -->
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="password"
              outlined
              dense
              placeholder="Password"
              class="register__input"
              hide-details
              type="password"
              :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
            >
              <template #prepend>
                <v-icon class="register__icon">mdi-lock</v-icon>
              </template>
            </v-text-field>
          </v-col>
        </v-row>

        <!-- Error Message -->
        <v-row v-if="errMsg" class="text-danger text-center">
          <v-col cols="12">
            <p class="error-msg">{{ errMsg }}</p>
          </v-col>
        </v-row>

        <!-- Register Button -->
        <v-row justify="center" class="mt-6">
          <v-btn
            block
            large
            class="register__submit sign-in__button"
            @click="handleRegister" 
          > 
          <!-- above for register i used replace the inline function with a dedicated method instead. 
           Solution: By moving the registration logic into a separate method (handleRegister), 
           it ensures Vue’s reactivity system handles updates properly. 
           This approach is cleaner and easier to debug, as the function is clearly defined in the script. -->
            <v-icon right class="button__icon">mdi-account</v-icon>
            <p>Register</p>
          </v-btn>
          <p class="text-muted">or</p>
          <v-btn
            block
            large
            class="google__submit sign-in__button"
            @click="registerWithGoogle"
          >
            <v-icon left>mdi-google</v-icon>
            <p>Register with Google</p>
          </v-btn>
        </v-row>
      </v-card>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

// Extracting email, password, error message, register method, and Google registration from useAuth composable
const { email, password, errMsg, register, signInWithGoogle } = useAuth();

// Define reactive variables for first name
const firstName = ref('');

// Define a method to handle registration with email and password
const handleRegister = async () => {
  try {
    // Call the register method and pass the required values
    await register(firstName.value, email.value, password.value);
  } catch (error) {
    console.error("Error during registration:", error);
  }
};

// Register with Google (no need for firstName in this case)
const registerWithGoogle = async () => {
  await signInWithGoogle(); // Google handles user info retrieval
};
</script>

<style scoped>
/* Register Form Styling */
.register-form {
  width: 350px;
  background: linear-gradient(135deg, var(--light-color), var(--accent-color)); /* Smooth gradient */
  backdrop-filter: blur(10px); /* Glassy effect */
  padding: 2rem; /* Padding for spacing inside the form */
  box-shadow: var(--box-shadow-6s); /* Soft shadow for lifted effect */

}
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

/* Input field styling */
.register__input {
  color: var(--darker-color); /* Darker text color */
}

/* Button styling */
.register__button {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Smooth transition for hover */
  margin: 1rem auto; /* Center box horizontally and add margin */
  border-radius: 8px; /* Rounded corners for cards */
  position: relative;
  display: inline-block;
  box-shadow: var(--box-shadow-diffuse); /* Initial diffuse shadow */
  color: var(--darker-color); /* Darker text color for button */
}

.register__button:hover {
  transform: var(--hover-transform); /* Apply the hover transform effect */
  box-shadow: var(--hover-box-shadow); /* Apply the hover shadow effect */
}

/* Error message */
.text-danger {
  font-weight: 500;
  margin-top: 10px;
  font-size: 0.9rem;
}

h1 {
  font-size: 2rem;
  color: var(--darker-color); /* Change title color to darker color */
  font-family: var(--heading-font-family);
}
/* Responsive adjustments */
@media screen and (max-width: 400px) {
  .login-form {
    width: 100%; /* Make form full width on smaller screens */
  }

  h1 {
    font-size: 1.8rem; /* Reduce title font size for smaller screens */
  }

  .reigster__input {
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