<template>
  <v-container fluid class="my-account-container">
    <v-row>
      <v-col cols="12">
        <v-card class="account-card">
          <v-card-title class="d-flex justify-space-between align-center">
            <h3 class="account-title">My Account</h3>
            <v-btn 
              icon 
              @click="dialog = true" 
              aria-label="Account settings" 
              class="settings-button" 
              v-tooltip="'Account Settings'"
              small 
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Logout Confirmation Dialog -->
          <v-dialog v-model="dialog" max-width="500">
            <v-card>
              <v-card-title>
                <span>Account Settings</span>
              </v-card-title>

              <v-card-text>
                <AccountDialog />
                <p class="text-center">Are you sure you want to log out?</p>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="dialog = false">Cancel</v-btn>
                <v-btn text @click="logOut">Log Out</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-card-text>
            <p class="account-description">Manage your personal details and set your goals to track your progress effectively.</p>
            <v-form ref="form" v-model="valid" @submit.prevent="saveUserData">
              <!-- Personal Information Section -->
              <h4 class="section-title">
                <v-icon class="section-icon">mdi-account-circle</v-icon>
                Your Information
              </h4>
              <v-divider class="mb-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email Address"
                    v-model="email"
                    :rules="emailRules"
                    required
                    :hint="'We will never share your email.'"
                    persistent-hint
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="First Name"
                    v-model="firstName"
                    :rules="nameRules"
                    required
                  />
                </v-col>
              </v-row>

              <!-- Goals Section -->
              <h4 class="section-title">
                <v-icon class="section-icon">mdi-target</v-icon>
                Your Goals
              </h4>
              <v-divider class="mb-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Improvement"
                    v-model="goals[0]"
                    :rules="goalRules"
                    placeholder="Enter your first goal"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Improvement"
                    v-model="goals[1]"
                    :rules="goalRules"
                    placeholder="Enter your second goal"
                    required
                  />
                </v-col>
              </v-row>

              <!-- Swim Goals Section -->
              <h4 class="section-title">
                <v-icon class="section-icon">mdi-swim</v-icon>
                Your Swim Goals
              </h4>
              <v-divider class="mb-3"></v-divider>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="targetSwimLogs"
                    label="Set Your Target Swim Log Goal"
                    type="number"
                    min="0"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Swim Goal 1"
                    v-model="swimGoals[0]"
                    :rules="goalRules"
                    placeholder="Enter your first swim goal"
                    required
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Swim Goal 2"
                    v-model="swimGoals[1]"
                    :rules="goalRules"
                    placeholder="Enter your second swim goal"
                    required
                  />
                </v-col>
              </v-row>

              <!-- Personal Best Section -->
              <h4 class="section-title">
                <v-icon class="section-icon">mdi-trophy-outline</v-icon>
                Personal Bests
              </h4>
              <v-divider class="mb-3"></v-divider>
              <v-row>
                <v-col cols="3" md="6">
                  <v-text-field
                    label="Free/Crawl"
                    v-model="personalBests.crawl"
                    :rules="personalBestRules"
                    placeholder="Your fastest freestyle time"
                    required
                  />
                </v-col>
                <v-col cols="3" md="6">
                  <v-text-field
                    label="Breaststroke"
                    v-model="personalBests.breaststroke"
                    :rules="personalBestRules"
                    placeholder="Your fastest breaststroke time"
                    required
                  />
                </v-col>
                <v-col cols="3" md="6">
                  <v-text-field
                    label="Butterfly"
                    v-model="personalBests.butterfly"
                    :rules="personalBestRules"
                    placeholder="Your fastest butterfly time"
                    required
                  />
                </v-col>
                <v-col cols="3" md="6">
                  <v-text-field
                    label="Backstroke"
                    v-model="personalBests.backstroke"
                    :rules="personalBestRules"
                    placeholder="Your fastest backstroke time"
                    required
                  />
                </v-col>
              </v-row>

              <!-- Submit Button with Loading Spinner -->
              <v-btn type="submit" :disabled="loading" color="primary" block>
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  color="white"
                  size="20"
                />
                <span v-else>Save/Update Goals</span>
              </v-btn>

              <!-- Error Alert -->
              <v-alert v-if="errorMessage" type="error" class="mt-3" dismissible>
                {{ errorMessage }}
              </v-alert>
              <!-- Success Snackbar -->
              <v-snackbar v-model="snackbar" :timeout="3000" color="success" @close="snackbar = false">
                {{ snackbarMessage }}
              </v-snackbar>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { userService } from '@/composables/userService';
import AccountDialog from '@/components/AccountDialog.vue';

const { currentUser, logOut } = useAuth(); // Get currentUser data and logOut function

// Reactive references for user data
const email = ref('');
const firstName = ref('');
const goals = ref(['', '']); // Array for goals
const swimGoals = ref(['', '']); // Array for swim goals
const personalBests = ref({
  crawl: '', 
  breaststroke: '',
  butterfly: '',
  backstroke: ''
}); // Object for personal bests
const targetSwimLogs = ref(''); // Reactive variable for target swim logs
const errorMessage = ref(''); // For error handling
const snackbar = ref(false); // Snackbar visibility
const snackbarMessage = ref(''); // Snackbar message
const loading = ref(false); // Loading state
const valid = ref(false); // Form validation state
const dialog = ref(false); // Dialog visibility

// Validation rules
const emailRules = [(v) => !!v || 'Email is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid.'];
const nameRules = [(v) => !!v || 'First Name is required'];
const goalRules = [(v) => !!v || 'Goal is required'];
const personalBestRules = [(v) => !!v || 'Personal Best is required', (v) => (v >= 0) || 'Must be a positive number'];

// Fetch user data
const fetchUserData = async () => {
  if (currentUser.value) {
    loading.value = true; // Start loading
    try {
      const user = await userService.getUserData(currentUser.value.uid);
      if (user) {
        populateUserData(user);
      } else {
        errorMessage.value = "User data not found.";
      }
    } catch (error) {
      handleFetchError(error);
    } finally {
      loading.value = false; // Stop loading
    }
  }
};

// Populate user data into reactive references
const populateUserData = (user) => {
  email.value = user.email || '';
  firstName.value = user.firstName || '';
  goals.value = user.goals || ['', ''];
  swimGoals.value = user.swimGoals || ['', ''];
  targetSwimLogs.value = user.targetSwimLogs || '';
  personalBests.value = user.personalBests || {
    crawl: '',
    breaststroke: '',
    butterfly: '',
    backstroke: ''
  };
};

// Handle fetch error and display error message
const handleFetchError = (error) => {
  console.error('Error fetching user data:', error);
  errorMessage.value = "Failed to load user data. Please try again later.";
};

// Save user data including goals and swim goals
const saveUserData = async () => {
  if (currentUser.value && valid.value) { // Ensure form is valid
    loading.value = true; // Start loading
    try {
      await userService.updateUserData(currentUser.value.uid, {
        email: email.value,
        firstName: firstName.value,
        goals: goals.value,
        swimGoals: swimGoals.value,
        targetSwimLogs: targetSwimLogs.value,
        personalBests: personalBests.value // Update personal bests in user data
      });
      snackbarMessage.value = "User data updated successfully!";
      snackbar.value = true; // Show snackbar
    } catch (error) {
      handleSaveError(error);
    } finally {
      loading.value = false; // Stop loading
    }
  }
};

// Handle save error
const handleSaveError = (error) => {
  console.error('Error saving user data:', error);
  errorMessage.value = "Failed to save user data. Please try again.";
};

// Watch for changes inurrentUser and fetch user data
onMounted(() => {
  fetchUserData();
});

watch(currentUser, (newUser) => {
  if (newUser) {
    fetchUserData();
  }
});
</script>


<style scoped>
.my-account-container {
  padding: 20px;
  background-color: var(--accent-color);
  border-radius: 15px;
}

.account-card {
  padding: 20px;  
}

.section-title {
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
}

.section-icon {
  margin-right: 8px; /* Space between icon and title */
}

.account-title {
  text-align: start;
  color: var(--primary-color);
  font-weight: 700;
  margin-right: 8px; /* Space between icon and title */
}

.account-description {
  margin-bottom: 20px;
  color: var(--accent-color);
}

.settings-button {
  font-size: 15px;
  min-width: 32px; /* Ensures button has a minimum width */
  padding: 0; /* Reduces padding for a smaller button */
}

/* Responsive design adjustments */
@media (max-width: 600px) {
  .account-title {
    font-size: 1.5rem;
  }

  .account-description {
    font-size: 0.875rem;
  }

  .section-title {
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>