<template>
  <v-container class="mt-15" fluid>
    <v-row align="start" justify="center">
      <!-- Left Column: Welcome Section and Progress -->
      <v-col cols="12" md="6" class="welcome-section">
        <h1 class="greeting">Hello, {{ currentUser?.firstName || 'Swimmer' }}!</h1>
        <h2 class="subheading">Keep pushing towards your swimming goals!</h2>
        <p class="intro-text">
          Every lap counts! Track your progress, update your goals, and see how much you've accomplished. Let's dive in!
        </p>
        
        <!-- Motivational Quote -->
        <v-card class="quote-card my-2" outlined>
          <v-card-text class="text-center quote-text">
            <em>"The water is your friend. You don’t have to fight with water; just share with it."</em>
            <br /> — Dale Oen
          </v-card-text>
        </v-card>
        
        <!-- Button to Add New Swim Session -->
        <RouterLink to="/swimlogs">
            <v-btn class="swim-btn" elevation="5" depressed>
                Log Your Next Swim
                <v-icon left>mdi-plus</v-icon> 
              </v-btn>
        </RouterLink>
      </v-col>
      <v-col cols="12" md="6" class="personal-best-column mb-10">
  <v-card class="personalbest mb-4">
    <v-card-text>
      <h4 class="section-title">Your Personal Best:</h4>
      <v-divider></v-divider> <!-- Optional divider for separation -->
      <div class="personal-bests-list">
        <h4 class="PB">
          <strong>Crawl:</strong> <span class="personal-best-value">{{ personalBests.crawl || 'No Best Yet' }}</span> Seconds
        </h4>
        <h4 class="PB">
          <strong>Breaststroke:</strong> <span class="personal-best-value">{{ personalBests.breaststroke || 'No Best Yet' }}</span> Seconds
        </h4>
        <h4 class="PB">
          <strong>Butterfly:</strong> <span class="personal-best-value">{{ personalBests.butterfly || 'No Best Yet' }}</span> Seconds
        </h4>
        <h4 class="PB">
          <strong>Backstroke:</strong> <span class="personal-best-value">{{ personalBests.backstroke || 'No Best Yet' }}</span> Seconds
        </h4>
      </div>
    </v-card-text>
  </v-card>
  
  <v-card class="stats">
    <v-card-text>
      <h4 class="section-title">Swim Stats</h4>
      <v-divider></v-divider> <!-- Optional divider for separation -->
      <div class="swim-stats">
        <h4>Total Swim Logs: <span class="stats-value">{{ swimLogCount }}</span></h4> <!-- Total logs -->
        <h4>Total Distance Swum: <span class="stats-value">{{ totalDistance }}</span> meters</h4> <!-- Total distance -->
      </div>
      <v-btn color="" class="mt-4" elevation="2">
        <RouterLink to="/entries" class="text-black">YOUR SESSIONS</RouterLink>
      </v-btn>
    </v-card-text>
  </v-card>
</v-col>
      
<v-divider class="mb-10"></v-divider>
      <!-- Right Column: Goals and Swim Sessions -->
      <v-col cols="12" md="12">
        <div class="ag-format-container">
          <div class="ag-courses_box">
            <!-- Goals -->
            <div class="ag-courses_item" v-for="(goal, index) in goals" :key="index">
              <box class="ag-courses-item_link">
                <div class="ag-courses-item_bg"></div>
                <div class="ag-courses-item_title">Improve {{ index + 1 }}</div>
                <div class="ag-courses-item_date-box">
                  <span class="ag-courses-item_date">{{ goal || 'No Goal Set' }}</span>
                </div>
              </box>
            </div>
          </div></div>
        </v-col>
          <v-col cols="12" md="12">
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
    <RouterLink to="/about" class="text-center"> <p>Update or edit your goals?</p></RouterLink>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { userService } from '@/composables/userService';
import { swimLogService } from '@/composables/swimLogService'; // Adjust if your service is located elsewhere
import { useAuth } from '@/composables/useAuth';

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

/* Responsive adjustments for smaller screens */
@media only screen and (max-width: 979px) {
  .ag-courses_item {
    flex-basis: calc(30% - 30px);
  }
}

@media only screen and (max-width: 600px) {
  .ag-courses_item {
    flex-basis: 100%;
  }
}

.welcome-section {
  padding: 3rem;
  background-color: var(--primary-color);
  color: #fff;
  backdrop-filter: blur(10px);
  border-radius: 15px;
  box-shadow: var(--box-shadow-6s);
  position: relative;
  overflow: hidden;
  transition: transform 0.3s ease; /* Added transition for section hover */
}

.welcome-section:hover {
  transform: scale(1.02); /* Slight scale on hover for emphasis */
  transition: 0.3s ease-in-out;
  box-shadow: var(--box-shadow-4s);
}

.welcome-section::before,
.welcome-section::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  z-index: 0;
}

.welcome-section::before {
  width: 250px;
  height: 250px;
  top: -80px;
  left: -80px;
}

.welcome-section::after {
  width: 150px;
  height: 150px;
  bottom: -60px;
  right: -60px;
}

.greeting {
  font-size: var(--font-size-xxl);
  text-align: center;
  font-weight: 600;
  font-family: var(--heading-font-family);
  background: linear-gradient(to right, var(--paragraph-color), var(--secondary-color));
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.subheading {
  font-size: var(--font-size-xl);
  text-align: center;
  font-family: var(--heading-font-family);
  margin-bottom: 1rem;
}

.intro-text {
  font-size: var(--font-size-lg);
  color: var(--light-color);
  text-align: center;
  font-family: var(--paragraph-font-family);
  margin-bottom: 2rem;
}

.swim-btn {
  display: flex;
  margin: auto;
  width: 80%;
  height: 50px;
  background: linear-gradient(to right, var(--accent-color), var(--primary-color));
  color: white;
  transition: all 0.3s ease-in-out; /* Enhanced transition */
  border-radius: 5px;
  box-shadow: var(--box-shadow-4s);
}

.stats-card {
  background-color: var(--accent-color);
}

/* Tablet & Small Desktops (768px and below) */
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

  .progress-circle {
    width: 150px;
    height: 150px;
  }

  .percentage {
    font-size: 18px;
  }

  .logs-count {
    font-size: 14px;
  }
}

/* Small Devices & Mobile Phones (480px and below) */
@media (max-width: 480px) {
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

  .progress-circle {
    width: 130px;
    height: 130px;
  }

  .percentage {
    font-size: 16px;
  }

  .logs-count {
    font-size: 12px;
  }
  .ag-courses_item {
    flex-basis: 100%;
    margin-top: 5%;
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

  .progress-circle {
    width: 100px;
    height: 100px;
  }

  .percentage {
    font-size: 14px;
  }

  .logs-count {
    font-size: 10px;
  }

  .v-btn {
    font-size: 0.7rem;
    padding: 4px;
  }
}


.personal-best-column {
  padding: 0 20px; /* Extra padding for the column */
}

.personalbest, .stats {
  background-color: var(--dark-background); /* Use a dark background for contrast */
  color: white; /* Set text color to white */
  border-radius: 10px; /* Rounded corners */
  box-shadow: var(--box-shadow-6s); /* Box shadow for depth */
}

.section-title {
  font-size: 1.5rem; /* Larger title size */
  color: var(--accent-color); /* Accent color for titles */
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

/* Responsive adjustments */
@media (max-width: 600px) {
  .section-title {
    font-size: 1.2rem; /* Adjust section title size for smaller screens */
  }

  .PB {
    font-size: 1rem; /* Adjust personal best font size */
  }
}

.quote-card {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: var(--box-shadow-6s);
  transition: transform 0.3s ease-in-out; /* Smooth transition */
}
</style>

