<template>
  <v-container class="mt-10 container" fluid>
<v-row align="start" justify="center" class="item-center">
  <!-- Middle Column: Personal Best and Swim Stats -->
  <v-col cols="12"   class="welcome-section my-2"> <!-- Fixed width for the left column -->
    <h1 class="greeting">Hello, {{ currentUser?.firstName || 'Swimmer' }}!</h1>
    <h2 class="subheading">Keep pushing towards your swimming goals!</h2>
    <p class="intro-text">
      Every lap counts! Track your progress, update your goals, and see how much you've accomplished. Let's dive in!
    </p>
    <RouterLink to="/swimlogs">
      <v-btn class="swim-btn" elevation="5" depressed>
        Log Your Next Swim
        <v-icon left>mdi-plus</v-icon> 
      </v-btn>
    </RouterLink>
    </v-col>
    
    <GreetingAnim class="dividertext mt-10"/>
    <v-divider class=" mb-15 mb-5"></v-divider>

    <v-col cols="12" md="6" class="personal-best-column mb-10 item"> <!-- Make this column flexible -->
    <v-card class="personalbest mb-4">
      <v-card-text>
        <h4 class="section-title">Your Personal Best:</h4>
        <v-divider></v-divider>
        <div class="personal-bests-list">
          <h4 class="PB">
            <strong>Crawl:</strong> <span class="personal-best-value">{{ personalBests.crawl || 'No Best Yet' }}</span>
          </h4>
          <h4 class="PB">
            <strong>Breaststroke:</strong> <span class="personal-best-value">{{ personalBests.breaststroke || 'No Best Yet' }}</span> 
          </h4>
          <h4 class="PB">
            <strong>Butterfly:</strong> <span class="personal-best-value">{{ personalBests.butterfly || 'No Best Yet' }}</span>
          </h4>
          <h4 class="PB">
            <strong>Backstroke:</strong> <span class="personal-best-value">{{ personalBests.backstroke || 'No Best Yet' }}</span> 
          </h4>
        </div>
        <div class="d-flex justify-end mt-4"> 
          <v-btn class="goal-btn" elevation="2">
            <RouterLink to="/about" class="text-black">SET GOALS</RouterLink>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-col>
  <v-col cols="12"md="6" class="personal-best-column mb-10 item">
    <v-card class="stats">
      <v-card-text>
        <h4 class="section-title item">Swim Stats</h4>
        <v-divider></v-divider>
        <div class="swim-stats">
          <h4>Total Swim Logs: <span class="stats-value">{{ swimLogCount }}</span></h4>
          <h4>Total Distance Swum: <span class="stats-value">{{ totalDistance }}</span> meters</h4>
        </div>
        <div class="d-flex justify-end mt-4"> 
          <v-btn class="stats-btn mt-4" elevation="2">
            <RouterLink to="/entries" class="text-black">YOUR SESSIONS</RouterLink>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-col>

<v-divider class="mt-10 mb-10"></v-divider>
  <!-- Right Column: Goals and Swim Sessions -->
  <v-col cols="12" sm="12" md="6"> <!-- Fixed width for the right column -->
    <div class="ag-format-container">  
      <div class="ag-courses_box">
        <div class="ag-courses_item" v-for="(goal, index) in goals" :key="index">
          <div class="ag-courses-item_link">
            <div class="ag-courses-item_bg"></div>
            <div class="ag-courses-item_title">Improve {{ index + 1 }}</div>
            <div class="ag-courses-item_date-box">
              <span class="ag-courses-item_date">{{ goal || 'No Goal Set' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-col>
  <v-col cols="12" sm="12" md="6">
        <div class="ag-format-container">
          <div class="ag-courses_box">
            <div class="ag-courses_item" v-for="(swimGoal, index) in swimGoals" :key="index">
              <div class="ag-courses-item_link">
                <div class="ag-courses-item_bg"></div>
                <div class="ag-courses-item_title">Swim Goal {{ index + 1 }}</div>
                <div class="ag-courses-item_date-box">
                  <span class="ag-courses-item_date">{{ swimGoal || 'No Swim Goal Set' }}</span>
                </div>
              </div>
            </div>        
          </div>       
        </div>
      </v-col>
</v-row>

    <RouterLink to="/about" class="text-center"> 
      <p>Update or edit your goals?</p>
    </RouterLink>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { userService } from '@/composables/userService';
import { swimLogService } from '@/composables/swimLogService'; // Adjust if your service is located elsewhere
import { useAuth } from '@/composables/useAuth';
import GreetingAnim from '@/components/GreetingAnim.vue';


const { currentUser } = useAuth();

// const radius = 90; 
// const circumference = 2 * Math.PI * radius;

const goals = ref(['', '']); 
const swimGoals = ref(['', '']); 
const weeklySwimGoal = ref(''); 
const targetSwimLogs = ref(''); // Reactive variable for target swim logs
const swimLogCount = ref(0); 
const totalDistance = ref(0); 
const personalBests = ref({
  crawl: '',
  breaststroke: '',
  butterfly: '',
  backstroke: ''
});
// const progress = computed(() => Math.min((swimLogCount.value / targetSwimLogs.value) * 100, 100));
// const percentage = computed(() => Math.round(Math.min(Math.max(progress.value, 0), 100)));
// const offset = computed(() => circumference - (percentage.value / 100) * circumference);

// Fetch user data and swim logs
const fetchUserData = async () => {
  if (currentUser.value) {
    try {
      const user = await userService.getUserData(currentUser.value.uid);
      if (user) {
        goals.value = user.goals || ['', ''];
        swimGoals.value = user.swimGoals || ['', ''];
        weeklySwimGoal.value = user.weeklySwimGoal || ''; 
        targetSwimLogs.value = user.targetSwimLogs || ''; 
        swimLogCount.value = user.swimLogCount || 0; // Example; adjust as per your data structure
        totalDistance.value = user.totalDistance || 0; // Example; adjust as per your data structure
        personalBests.value = user.personalBests || {
          crawl: '',
          breaststroke: '',
          butterfly: '',
          backstroke: ''
        };// Load existing target swim logs

        // Fetch swim logs for the user
        const swimLogs = await swimLogService.getLogsForUser(currentUser.value.uid);
        swimLogCount.value = swimLogs.length; // Set the swim log count

        // Calculate total distance swum
        totalDistance.value = swimLogs.reduce((total, log) => total + (log.distance || 0), 0); // Assuming distance is a property in each log
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
};

onMounted(() => {
  fetchUserData();
});

watch(() => currentUser.value, (newUser) => {
  if (newUser) {
    fetchUserData();
  }
});
</script>

<style scoped>
.v-container {
  padding: 5%;
}
.dividertext{
  padding-left: 15px;
  margin-bottom: -1.2%;
  
}
.welcome-section {
  padding: 2rem; /* Add padding for spacing */
  background: 
    linear-gradient(to right, var(--accent-color),  rgba(0, 0, 0, 0.7) 100%), /* Adjusted gradient colors with opacity */
    url('../assets/introhead.jpeg') no-repeat center center; /* Background image */
  
  background-size: cover; /* Ensure the image covers the whole section */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
  transition: background-color 0.3s ease; /* Smooth background transition */
}

/* Add text shadow for better readability */
.greeting,
.subheading,
.intro-text {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 1); /* Subtle text shadow for contrast */
}

.greeting {
  font-size: 2.5rem; /* Increase size for a bold greeting */
  font-weight: 700; /* Bold weight for emphasis */
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  background-clip: text;
  -webkit-background-clip: text; /* Support for Safari */
  color: transparent;
  margin-bottom: 0.5rem; /* Space below greeting */
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2); /* Subtle text shadow */
}

.subheading {
  font-size: 1.5rem; /* Moderate size for subheading */
  color: var(--darker-color); /* Darker color for better readability */
  margin-bottom: 1.5rem; /* Space below subheading */
  font-weight: 500; /* Slightly lighter font weight */
}

.intro-text {
  font-size: 1.1rem; /* Slightly smaller font size */
  color: var(--darker-color); /* Darker color for better readability */
  margin-bottom: 2rem; /* Space below intro text */
  line-height: 1.6; /* Improve readability with line height */
}

.swim-btn {
  display: flex;
  justify-content: center; /* Center button text */
  align-items: center; /* Center icon vertically */
  width: 80%;
  max-width: 300px; /* Set a maximum width for the button */
  height: 50px;
  background: linear-gradient(to right, var(--primary-color) , var(--accent-color)); /* Blue gradient */
  border-radius: 8px; /* Rounded corners for the button */
  color: white;
  font-weight: 800; /* Bold font */
  border: none; /* Remove default border */
  transition: background-color 0.3s ease, transform 0.3s ease; /* Smooth transitions */
}

.swim-btn:hover {
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); /* Reverse gradient on hover */
  transform: translateY(-2px); /* Slight lift effect */
}
/* Responsive adjustments */
@media (max-width: 600px) {
  .greeting {
    font-size: 1.8rem; /* Adjust size for smaller screens */
  }

  .subheading {
    font-size: 1.2rem; /* Adjust subheading size */
  }

  .intro-text {
    font-size: 0.9rem; /* Slightly smaller font size */
  }

  .swim-btn {
    width: 100%; /* Full width on smaller screens */
    font-size: 1rem; /* Increase font size for better accessibility */
  }
}


h4 {
  font-size: large;
}

.v-btn {
  margin-top: 0.5em;
  box-shadow: var(--box-shadow-6s);
  transition: background-color 0.3s ease, transform 0.3s ease; /* Added transition for smoother hover effect */
}

.v-btn:hover {
  transform: scale(1.05); /* Slightly smaller scale for a smoother hover */
  background-color: var(--secondary-color);
  font-weight: bold;
  color: var(--light-color);
}

/* Responsive adjustments */
.ag-format-container {
  width: 100%;
  margin: 0 auto;
}

.ag-courses_box {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.ag-courses_item {
  flex-basis: calc(40%);
  margin: 0 15px 30px;
  position: relative;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #121212;
  transition: transform 0.3s ease; /* Added transition for hover effect */
}

.ag-courses_item:hover {
  transform: translateY(-5px); /* Slight lift on hover */
}

.ag-courses-item_link {
  display: block;
  padding: 20px;
  background-color: #121212;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  border-radius: 12px;
  transition: background-color 0.3s ease; /* Smooth background color transition */
}

.ag-courses-item_link:hover {
  background-color: rgba(255, 255, 255, 0.1); /* Light background on hover */
}

.ag-courses-item_bg {
  height: 120px;
  width: 120px;
  background-color: #f9b234;
  position: absolute;
  top: -75px;
  right: -75px;
  border-radius: 50%;
  transition: transform 0.5s ease, opacity 0.3s ease; /* Added opacity transition */
}

.ag-courses-item_link:hover .ag-courses-item_bg {
  transform: scale(10);
  opacity: 0; /* Fade out effect on hover */
}

.ag-courses-item_title {
  min-height: 87px;
  font-weight: bold;
  font-size: var(--font-size-xxl);
  position: relative;
}

.ag-courses-item_date-box {
  font-size: var(--font-size-lg);
  position: relative;
}

.ag-courses-item_date {
  font-weight: bold;
  color: var(--paragraph-color);
  transition: color 0.5s ease; /* Smooth color transition */
}

.ag-courses_item:nth-child(2n) .ag-courses-item_bg {
  background-color: var(--accent-color);
}

.ag-courses_item:nth-child(3n) .ag-courses-item_bg {
  background-color: var(--secondary-color);
}

.ag-courses_item:nth-child(4n) .ag-courses-item_bg {
  background-color: var(--primary-color);
}

.personal-best-column {
  flex-grow: 1; /* Allows this column to stretch */
  padding: 0 20px; /* Extra padding for the column */
}

.personalbest,
.stats {
  background: transparent;
  color: white; /* Set text color to white */
  box-shadow: var(--box-shadow-6s); /* Box shadow for depth */
}

.section-title {
  font-size: 1.5rem; /* Larger title size */
  color: var(--accent-color); /* Accent color for titles */
  font-weight: 600;
  margin-bottom: 10px; /* Space below the title */
  text-align: center; /* Center align titles */
}

.personal-bests-list {
  margin-bottom: 20px; /* Space below the personal bests */
}

.PB {
  display: flex;
  justify-content: space-between; /* Space out labels and values */
  padding: 3px 0; /* Vertical spacing */
  font-size: 1.1rem; /* Slightly larger font size */
}

.personal-best-value {
  color: var(--secondary-color); /* Use a highlight color for personal best values */
  font-weight: bold; /* Bold the personal best values */
}

.swim-stats {
  margin-bottom: 20px; /* Space below the stats */
}

.stats-value {
  color: var(--highlight-color); /* Use the same highlight color for statistics */
  font-weight: bold; /* Bold the stats values */
}


.item-center {
  display: flex;
  flex-direction: row; /* Align items in a row */
  align-items: flex-start; /* Align items at the start */
}

.welcome-section,
.ag-courses_box {
  width: 100%; /* Ensure these elements take full width of their parent */
}

.personal-best-column {
  padding: 0 20px; /* Extra padding for the column */
}


@media only screen and (max-width: 600px) {
  .v-btn {
    padding: 0.4rem;
    font-size: 0.75rem;
  }

  .greeting {
    font-size: 1.5rem;
  }

  .subheading {
    font-size: 1rem;
  }

  .intro-text {
    font-size: 0.9rem;
  }

  .ag-courses_item {
    flex-basis: 100%;
    margin-top: 5%;
  }
  .section-title {
    font-size: 1.2rem; /* Adjust section title size for smaller screens */
  }

  .PB {
    font-size: 1rem; /* Adjust personal best font size */
  }
  .dividertext{
  padding-left: 15px;
  margin-bottom: -4.5%;
  
}
}

@media (max-width: 1024px) {
  .greeting {
    font-size: 1.8rem;
  }

  .subheading {
    font-size: 1.2rem;
  }

  .intro-text {
    font-size: 1rem;
  }

  .ag-courses_item {
    flex-basis: 80%;
  }
 
  .dividertext{
  padding-left: 15px;
  margin-bottom: -1.9%;
  
}
}

/* Very Small Devices (320px and below) */
@media (max-width: 320px) {
  .greeting {
    font-size: 1.2rem;
  }

  .subheading {
    font-size: 0.9rem;
  }

  .intro-text {
    font-size: 0.8rem;
  }

  .v-btn {
    font-size: 0.7rem;
    padding: 4px;
  }
}


</style>