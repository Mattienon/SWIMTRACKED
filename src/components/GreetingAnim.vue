<template>
  <h1 class="ml13" ref="textWrapperRef">
    SWIMTRACKED
  </h1>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import anime from 'animejs/lib/anime.es.js'; // Import Anime.js

const textWrapperRef = ref(null); // Reference for the heading element

// Function to wrap every letter in a span
const wrapLetters = () => {
  const textWrapper = textWrapperRef.value;
  textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
};

// Animation function
const startAnimation = () => {
  anime.timeline({ loop: true })
    .add({
      targets: '.ml13 .letter',
      translateY: [100, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 2000,
      delay: (el, i) => 300 + 30 * i
    }).add({
      targets: '.ml13 .letter',
      translateY: [0, -100],
      opacity: [1, 0],
      easing: "easeInExpo",
      duration: 1200,
      delay: (el, i) => 100 + 30 * i
    });
};

// Start the animation on component mount
onMounted(() => {
  wrapLetters();
  startAnimation();
});
</script>

<style scoped>
.ml13 {
  font-size: 1.3em;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  font-weight: 900;
}

.ml13 .letter {
  display: inline-block;
  line-height: 1em;
}
</style>