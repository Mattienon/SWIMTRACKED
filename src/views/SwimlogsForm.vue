<template>
  <v-container class="mt-2">
    <h1>Swim Session</h1>
    <h2>Keep track of your swimming with Swim Sessions</h2>
    <v-stepper class="v-stepper" v-model="step" :items="['Lanes', 'Style', 'Video', 'Date', 'Summary']">
      <!-- Step 1: Course Length Selection -->
      <template v-slot:item.1>
        <v-card flat class="background">
          <h2>Course Length</h2>
          <v-item-group>
            <v-row>
              <v-col v-for="(length, index) in [25, 50]" :key="index" cols="12" md="6">
                <v-item v-slot="{ selectedClass }">
                  <v-card
                    :class="['d-flex align-center', selectedClass]"
                    height="100"
                    dark
                    @click="selectCourseLength(length)"
                    :style="{ backgroundColor: selectedCourseLength === length ? '#E74C3C' : '#4398Db' }"
                  >
                    <div class="text-h3 flex-grow-1 text-center">{{ length }}</div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>

          <!-- Distance Slider -->
         
          <v-card-text>
            <p> Drag to input distance</p>
            <v-slider
              v-model="distanceValue"
              min="0"
              max="2000"
              step="50"
              @input="updateSlider"
              ticks
              thumb-label
              :color="sliderColor"
              :thumb-size="25"
              class="swim-slider"
            />
            <div class="mt-2">{{ distanceValue }} meters</div>
          </v-card-text>
        </v-card>
      </template>

      <!-- Step 2: Swim Style Selection -->
      <template v-slot:item.2>
        <v-card flat class="background">
          <h2>Swim Style</h2>
          <v-card-text>
            <v-btn-group>
              <v-btn
                v-for="style in ['Breast', 'Free', 'Back', 'Butterfly']"
                :key="style"
                @click="toggleSwimStyle(style)"
                :class="{ 'v-btn--active': swimStyle.includes(style) }"
                :style="{ backgroundColor: swimStyle.includes(style) ? '#E74C3C' : '#ECF0F1', color: swimStyle.includes(style) ? '#ECF0F1' : '#2C3E50' }"
              >
                {{ style }}
              </v-btn>
            </v-btn-group>
              <p>Overall lap time</p>
              <v-text-field
                v-model="lapTime"
                label="Input in seconds"
                type="number"
                min="0"
                prepend-icon="mdi-swim"
                class="v-text-field-input"
              ></v-text-field>
          </v-card-text>
        </v-card>
      </template>

      <!-- Step 3: Video Upload -->
      <template v-slot:item.3>
        <v-card flat class="background">
          <h2>Upload Video</h2>
          <v-card-text>
            <input type="file" @change="handleVideoUpload" accept="video/*" class="text-black choose-file"/>
            <template v-if="videoUrl">
              <video :src="videoUrl" class="video-fluid mb-2" controls></video>
            </template>
            <template v-else>
              <span class="upload-message">No video uploaded.</span>
            </template>
            <br><br>
            <v-divider></v-divider>
            <h2>Today's Notes</h2>
            <v-textarea
              placeholder="Notes"
              v-model="notes"
              class="notes-textarea"
            ></v-textarea>
          </v-card-text>
        </v-card>
      </template>

      <!-- Step 4: Date Selection -->
      <template v-slot:item.4>
        <v-container>
          <v-card flat class="background">
          <h2>Date</h2>
          <input type="date" v-model="datePicked" class="date-input" />
          <br>
          <v-divider></v-divider>
          <h2>Time of Day</h2>
          <v-btn-group>
            <v-btn
              v-for="time in ['Morning', 'Midday', 'Evening']"
              :key="time"
              @click="timeOfDay = time"
              :class="{ 'v-btn--active': timeOfDay === time }"
            >
              {{ time }}
            </v-btn>
          </v-btn-group>
        </v-card>
        </v-container>
      </template>

      <!-- Step 5: Final Summary -->
      <template v-slot:item.5>
        <v-card flat class="background">
          <v-card-text>
            <h2>Final Summary</h2>
            <v-col cols="12">
              <v-sheet cols="12" md="4">
                <div><strong>Course Length:</strong> {{ selectedCourseLength }}</div>
                <div><strong>Distance:</strong> {{ distanceValue }} meters</div>
                <div><strong>Swim Style:</strong> {{ swimStyle.join(', ') }}</div> <!-- Join styles for display -->
                <div><strong>Lap Time:</strong> {{ lapTime }} seconds</div>
              </v-sheet>
              <v-sheet cols="12" md="4">
                <div><strong>Date:</strong> {{ datePicked }}</div>
                <div><strong>Time of Day:</strong> {{ timeOfDay }}</div>
              </v-sheet>
              <v-sheet cols="12" md="4">
                <div><strong>Video:</strong> <a v-if="videoUrl" :href="videoUrl" target="_blank">View Video</a></div>
                <div><strong>Notes:</strong> {{ notes }}</div>
              </v-sheet>
            </v-col>
            <v-btn @click="finishLog" to="/entries" color="#E74C3C" class="mt-2">Finish Log / Save</v-btn>
          </v-card-text>
        </v-card>
      </template>
    </v-stepper>
  </v-container>
</template>

<script setup>
//move all of this an make dumb component 
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { swimLogService } from '../composables/swimLogService.js';
import { useAuth } from '@/composables/useAuth'; 
import { uploadFile } from '@/firebase.config'; 

const step = ref(1);
const selectedCourseLength = ref('');
const distanceValue = ref(0);
const swimStyle = ref([]); // Array for multiple swim styles
const notes = ref('');
const videoUrl = ref('');
const timeOfDay = ref('');
const datePicked = ref(new Date().toISOString().split('T')[0]);
const lapTime = ref(0); // Added lap time as reactive reference

const { currentUser } = useAuth();
const swimLogs = ref([]);
const fetchLogs = async () => {
  if (currentUser.value) {
    swimLogs.value = await swimLogService.getLogsForUser(currentUser.value.uid);
  }
};

onMounted(fetchLogs);

// Computed property for dynamic color
const sliderColor = computed(() => {
  if (distanceValue.value < 800) return 'blue';    
  if (distanceValue.value < 1600) return 'green';  
  return 'red';                                    
});

// Select Course Length
const selectCourseLength = (number) => {
  selectedCourseLength.value = number;
};

// Toggle swim style selection (add/remove from array)
const toggleSwimStyle = (style) => {
  if (swimStyle.value.includes(style)) {
    swimStyle.value = swimStyle.value.filter(s => s !== style); // Remove style if already selected
  } else {
    swimStyle.value.push(style); // Add style if not selected
  }
};

const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      videoUrl.value = await uploadFile(file, currentUser.value.uid);
      console.log('Video uploaded successfully:', videoUrl.value);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  }
};

const router = useRouter(); // Define router to navigate to Entries
// Finish Log / Save
const finishLog = async () => {
  if (!currentUser.value) {
    console.error("User is not logged in.");
    return;
  }

  const logData = {
    userId: currentUser.value.uid,
    courseLength: selectedCourseLength.value,
    distance: distanceValue.value,
    swimStyle: swimStyle.value.join(', '), // Convert array to string for storage
    lapTime: lapTime.value, // Include lap time
    date: datePicked.value,
    notes: notes.value,
    videoUrl: videoUrl.value,
    timeOfDay: timeOfDay.value,
  };

  try {
    const docRef = await swimLogService.addLog(logData, currentUser.value.uid);
    console.log('Log saved with ID:', docRef.id);
    await router.push({ name: 'entries' });
  } catch (e) {
    console.error('Error saving log:', e);
  }
};
</script>
<style scoped>
/* Main Container Styles */
.v-container {
  text-align: center;
  max-width: 800px; /* Set a maximum width for the container */
  margin: auto; /* Center the container */
}

/* Heading Styles */
h1 {
  font-size: 2.5rem; /* Increase the font size for the main heading */
  color: var(--secondary-color); /* Dark color for the main heading */
  font-weight: 900;
  margin-bottom: 10px; /* Space below main heading */
}

h2 {
  font-size: 1.5rem; /* Slightly larger subheading */
  color: var(--light-color); /* Darker color for the subheading */
  font-weight: 700;
  margin: 10px 0; /* Add margin above and below subheading */
}

/* Card Styles */
.background {
  margin: 10px 0; /* Margin between cards */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow */
  padding: 2rem;
  background-color: var(--primary-color);
  color: #fff;
  backdrop-filter: blur(10px);
  box-shadow: var(--box-shadow-s);
  position: relative;
  overflow: hidden;
}
.background::before,
.background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  z-index: 0;
  pointer-events: none;
}

.background::before {
  width: 250px;
  height: 250px;
  top: -80px;
  left: -80px;
}

.v-card::after {
  width: 150px;
  height: 150px;
  bottom: -60px;
  right: -60px;
}
.v-stepper{
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Soft shadow */
  background-color: var(--primary-color);
  color: #fff;
  box-shadow: var(--box-shadow-diffuse);

}

/* Button Group Styles */
.v-btn-group {
  height: 190px;
}

/* Button Styles */
.v-btn {
  margin: 0.3rem;
  border-radius: 20px; /* Rounded buttons */
  font-weight: bold; /* Bold text for buttons */
  transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth transition for background and scaling */
}

.v-btn--active {
  background-color: var(--secondary-color); /* Active button color */
  color: #fff; /* White text on active buttons */
  transform: scale(1.05); /* Slightly increase size of active button */
}

.v-btn:not(.v-btn--active) {
  background-color: #ECF0F1; /* Default button color */
  color: #2C3E50; /* Dark text color */
}
/* Slider Styles */
.v-slider {
  margin: 20px 0; /* Add margin above and below the slider */
  height: 20px; /* Set height for the slider */
}

/* Text Area Styles */
.v-textarea {
  background-color: #ECF0F1; /* Light background for the textarea */
  border-radius: 10px; /* Rounded corners */
  color: #2C3E50; /* Dark text color */
  transition: background-color 0.3s ease; /* Smooth transition */
  min-height: 100px; /* Minimum height for better user experience */
}

.v-textarea:focus {
  background-color: var(--secondary-color); /* Change background on focus */
  color: #ECF0F1; /* Change text color on focus */
}

/* Video Styles */
.video-fluid {
  max-width: 100%; /* Responsive video */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px; /* Rounded corners for video */
}

/* Input Date Styles */
input[type="date"] {
  margin: 10px auto; /* Center align date input */
  padding: 10px; /* Padding inside date input */
  color: var(--light-color);
  border: 2px solid var(--accent-color); /* Border color */
  border-radius: 5px; /* Rounded corners */
  width: 50%; /* Full width for input */
  display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
}

/* Final Summary Card */
.v-card.title {
  font-weight: bold; /* Make the title bold */
  font-size: 1.5rem; /* Increase title font size */
}
.v-text-field-input{
  display: flex;
  margin: auto;
  justify-content: center;
}
/* Miscellaneous */
.upload-message {
  color: #7f8c8d; /* Gray color for upload message */
  font-style: italic; /* Italic style for message */
}
.choose-file{
  background-color: var(--accent-color);
}

.date-input {
  margin: 10px auto; /* Center align date input */
}
/* Small devices (phones, 300px to 600px) */
@media only screen and (max-width: 600px) {
  .v-container {
    padding: 0;
    max-width: 100%; /* Full width for small screens */
    
  }

  h1 {
    font-size: 1.6rem; /* Smaller font for main heading */
  }

  h2 {
    font-size: 1rem; /* Smaller font for subheading */
  }

  .v-card {
    margin: 0; /* Smaller margins for cards */
    padding: 10px; /* Add padding for small screens */
  }

  .v-btn {
    font-size: 0.9rem; /* Reduce button font size */
    padding: 10px; /* Adjust button padding */
  }

  .v-btn-group {
    flex-direction: column;
/* Make buttons wrap if needed */
  }

  .v-textarea {
    font-size: 0.9rem; /* Smaller text in textarea */
  }

  .v-slider {
    height: 15px; /* Slightly smaller slider for small devices */
  }

  input[type="date"] {
    width: 100%; /* Full width date input for small screens */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
  }

  .upload-message {
    font-size: 0.85rem; /* Smaller text for messages */
  }
}

/* Medium devices (tablets, 600px to 900px) */
@media only screen and (min-width: 600px) and (max-width: 900px) {
  .v-container {
    padding: 15px;
    max-width: 95%; /* Adjust width for tablets */
  }

  h1 {
    font-size: 2.2rem; /* Slightly smaller font for main heading */
  }

  h2 {
    font-size: 1.4rem; /* Adjust font size for subheading */
  }

  .v-card {
    margin: 12px 0; /* Adjust card margins */
    padding: 12px; /* Adjust card padding */
  }

  .v-btn {
    font-size: 1rem; /* Adjust button font size */
  }

  .v-slider {
    height: 18px; /* Slightly smaller slider */
  }

  input[type="date"] {
    width: 80%; /* Adjust width for tablets */
  }

  .v-textarea {
    font-size: 1rem; /* Adjust textarea font size */
  }
}
</style>