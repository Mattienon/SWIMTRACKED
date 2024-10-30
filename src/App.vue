<template>
  <img src="./assets/SVG/Asset 2.svg" class="topwave" alt="Top wave">

  <!-- Header Section -->
  <header>
    <div class="uppernav d-flex justify-space-between px-5 align-center">
      <!-- Logo Section -->
      <RouterLink to="/">
        <p class="logo" title="Go to Home">SWIMTRACKED</p>
      </RouterLink>

      <!-- Navigation Bar -->
      <nav class="nav">
        <div class="nav-links">
          <RouterLink to="/">HOME</RouterLink>
          <RouterLink to="/swimlogs">
            ADD <v-icon class="align-center" size="16px">mdi-plus</v-icon>
          </RouterLink>
          <RouterLink to="/entries">ENTRIES</RouterLink>
          <RouterLink v-if="currentUser" to="/about" title="About Us">
            <v-icon>mdi-account</v-icon>
          </RouterLink>
          <RouterLink v-else to="/signupin" title="Sign In/Sign Up">
            <v-icon>mdi-account</v-icon>
          </RouterLink>
        </div>
      </nav>
    </div>
  </header>

  <!-- Main Content with Transition -->
  <main>
    <transition name="fade" >
      <RouterView />
    </transition>
  </main>

  <!-- Box Section -->
  <div class="box mt-5">
    <div class="box-2"></div>
  </div>
  
  <!-- Footer Section -->
  <div class="footer text-center">
    <GreetingAnim/>
      <p>For the everyday Swimmer @{{ new Date().getFullYear() }} </p>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import GreetingAnim from './components/GreetingAnim.vue';

// Use the authentication composable
const { currentUser } = useAuth(); // Get the currentUser reference
</script>

<style scoped>
/*
  Enter and leave animations can use different
  durations and timing functions.
*/
/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.logo {
  font-family: var(--heading-font-family);
  font-weight: 700;
  background: linear-gradient(to right, var(--light-color), var(--accent-color));
  background-clip: text;
  color: transparent;
  font-size: 1.5rem;
}

.logo:hover {
  background: linear-gradient(to right, var(--light-color), var(--secondary-color));
  transform: scale(1.05); /* Slightly increase size on hover */
  background-clip: text;
  transition:0.5s ease-in-out, transform 0.3s ease; /* Adding transform transition */
}

/* Body Styles */
body {
  margin: 0;
  height: 100vh;
  display: grid;
  place-content: center;
  background-color: #000;
}


.box {
  width: 120%; /* Full width */
  height: 130px; /* Set height to make it visible */
  background-color: var(--primary-color); /* Primary color */
  margin: -12px auto; /* Center the box */
  display: block; /* Ensure it behaves as a block element */

  /* Masking Properties */
  --mask: radial-gradient(54.67px at 50% 77px, #000 99%, #0000 101%) calc(50% - 70px) 0/140px 100%,
          radial-gradient(54.67px at 50% -42px, #0000 99%, #000 101%) 50% 35px/140px 100% repeat-x;
  -webkit-mask: var(--mask);
  mask: var(--mask);

  /* Animation Wave Speed */
  animation: wave 3s ease-in-out infinite;
}
.box-2{
  width: 105%; /* Full width */
  height: 100px; /* Set height to make it visible */
  background: linear-gradient(to bottom, var(--accent-color), var(--primary-color));
  display: block; /* Ensure it behaves as a block element */

  /* Masking Properties */
  --mask: radial-gradient(54.67px at 50% 77px, #000 99%, #0000 101%) calc(50% - 70px) 0/140px 100%,
          radial-gradient(54.67px at 50% -42px, #0000 99%, #000 101%) 50% 35px/140px 100% repeat-x;
  -webkit-mask: var(--mask);
  mask: var(--mask);

  /* Animation Wave Speed */
  animation: waveX 4s ease-in-out infinite;
}
/* Keyframes for the water-like animation */
@keyframes waveX {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(-80px); /* Move up */
    
  }
  100% {
    transform: translateX(0); /* Back to original position */
  }
}
/* Keyframes for the water-like animation */
@keyframes wave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Move up */
    
  }
  100% {
    transform: translateY(0); /* Back to original position */
  }
}

/* Layout and Structure */
main {
  display: flex;
  justify-content: center;
  margin: auto;
  width: clamp(200px, 90vw, 1500px);
}

.uppernav {
  background-color: var(--primary-color);
  color: var(--light-color);
}

nav {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: space-around;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  font-weight: 600;
  font-size: 16px;
  color: var(--light-color);
  transition: 0.4s;
}
nav a:first-of-type {
  border: none;
}
nav a:hover {
  color: var(--secondary-color);
}

/* Wave Images */
.topwave {
  margin-top: -10%;
  left: -1%;
  z-index: -1;
  position: absolute;
  width: 105%;
  overflow: hidden;
}

/* Typography Styles */
p {
  padding-left: 10px;
  font-size: small;
  color: var(--paragraph-color);
  font-family: var(--paragraph-font-family);
  margin: var(--paragraph-margin);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  color: var(--heading-color);
  font-family: var(--heading-font-family);
  margin: var(--heading-margin);
}

/* Button Styles */
.v-btn {
  background-color: var(--primary-color);
  color: var(--light-color);
  font-size: smaller;
}
.v-btn:hover {
  background-color: var(--secondary-color);
}

/* Footer Styles */
.footer {
  background-color: var(--primary-color);
  padding: 1rem;
}

/* Responsive Styles */

/* Tablet & Small Desktops (768px and below) */
@media (max-width: 768px) {
  .uppernav {
    flex-direction: column;
    align-items: center;
    padding: 1rem;
  }

  .nav {
    margin: auto;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
  }

  nav a {
    padding: 0.5rem 0.75rem;
    font-size: 16px;
  }

  .topwave {
    display: none;
  }

  .box {
    height: 80px;
  }
}

/* Small Devices & Mobile Phones (480px and below) */
@media (max-width: 480px) {
  .logo {
    font-size: 1.2rem; /* Reduce the logo font size */
    text-align: center;
  }

  .nav {
    text-align: center;
  }

  nav a {
    font-size: 16px;
    padding: 0.3rem 0.8rem; /* Less padding on smaller screens */
  }

  .box{
    height: 80px; /* Adjust height for mobile */
  }
  .box-2{
    height: 80px;;
  }

  .topwave {
    margin-top: 10%;
    width: 110%;
    left: -5%;
  }

  .footer {
    padding: 0.5rem;
    font-size: 12px;
  }
}

/* Very Small Devices (320px and below) */
@media (max-width: 320px) {
  .logo {
    font-size: 1rem;
  }

  nav a {
    font-size: 14px;
    text-align: center;
  }

  .box {
    height: 50px;
  }
  .box-2{
    height: 20px;;
  }

  .footer {
    font-size: 12px;
  }
}
</style>