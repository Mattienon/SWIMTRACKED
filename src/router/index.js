import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'; 
import HomeView from '../views/HomeView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/swimlogs',
      name: 'swimlogs',
      component: () => import('../views/SwimlogsForm.vue'),
      meta: {
        requiresAuth: true, // Require authentication for this route
      },
    },

    {
      path: '/entries',
      name: 'entries',
      component: () => import('../views/Entries.vue'),
      meta: {
        requiresAuth: true, // Require authentication for this route
      },
    },
    {
      path: '/signupin',
      name: 'signupin',
      component: () => import('../views/SignUpIn.vue')
    },
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener(); // Remove the listener after getting the user
        resolve(user);
      },
      reject
    );
  });
}

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const user = await getCurrentUser();
    console.log("Current User:", user); // Log the user to see what you're getting
    if (user) {
      next(); // User is authenticated, allow access
    } else {
      alert("You must be signed in to access this page.");
      next({ name: 'signupin' }); // Redirect to sign up/sign in page
    }
  } else {
    next(); // Proceed if the route doesn't require authentication
  }
});

export default router;