<template>
  <v-container>
    <h1 class="text-center">Swim Logs</h1>

    <v-row class="swim-log-row">
      <v-col v-for="log in paginatedLogs" :key="log.id" cols="12" md="4" class="mb-4">
        <v-card class="mx-auto elevation-2">
          <video
            muted
            class="video-cover"
            @mouseover="playVideo"
            @mouseleave="pauseVideo"
            :poster="log.videoUrl ? getThumbnail(log.videoUrl) : stockThumbnail"
          >
            <source :src="log.videoUrl || stockVideo" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <v-card-title class="text-dark">
            <strong class="text-center log-title">Session: {{ log.date }}</strong>
          </v-card-title>

          <v-card-subtitle class="text-muted"> Logged on {{ log.date }} </v-card-subtitle>

          <v-card-actions>
            <v-btn color="orange-lighten-2" text @click="openEditDialog(log)">Edit</v-btn>
            <v-btn color="error" text @click="deleteLog(log.id)">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :icon="log.show ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              @click="log.show = !log.show"
            ></v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="log.show">
              <v-divider></v-divider>
              <v-card-text>
                <strong>LANE LENGTH:</strong><br />
                <span>{{ log.courseLength }} meters</span><br />
                <strong>DISTANCE:</strong><br />
                <span>{{ log.distance }} meters</span><br />
                <strong>STYLE:</strong><br />
                <span>{{ log.swimStyle }}</span
                ><br />
                <strong> LAP TIME:</strong><br />
                <span>{{ log.lapTime }} seconds</span><br />
                <hr class="log-separator" />
                <strong>TIME OF DAY:</strong><br />
                <span>{{ log.timeOfDay || 'No time provided' }}</span
                ><br />
                <hr class="log-separator" />
                <strong>NOTES:</strong><br />
                <span>{{ log.notes || 'No notes' }}</span
                ><br />
                <strong>VIDEO:</strong>
                <a
                  v-if="log.videoUrl"
                  class="text-info video-link"
                  :href="log.videoUrl"
                  target="_blank"
                  >Watch Video</a
                >
                <span v-else class="text-muted">No video available</span>
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <!-- Custom Pagination Component -->
    <Pagination v-model="currentPage" :total-pages="totalPages" />

    <!-- Swim Log Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <h1 class="text-center">Edit Swim Log</h1>
          <!-- Changed to fixed text -->
        </v-card-title>
        <v-card-text>
          <v-select v-model="logForm.courseLength" :items="courseLength" label="Lane Length" />
          <v-text-field v-model="logForm.distance" label="Distance (meters)" type="number" />
          <v-text-field v-model="logForm.lapTime" label="Lap Time (seconds)" type="number" />
          <v-select
            v-model="logForm.swimStyle"
            :items="swimStyle"
            label="Swim Style"
            multiple
            solo
          />
          <v-text-field v-model="logForm.date" label="Date" type="date" />
          <v-select v-model="logForm.timeOfDay" :items="timeOfDay" label="Time Of Day" />
          <v-textarea v-model="logForm.notes" label="Notes" placeholder="Add any notes here" />

          <!-- File input for uploading video -->
          <v-file-input label="Upload Video" accept="video/*" @change="handleVideoUpload" />

          <!-- Video display in the dialog -->
          <a v-if="logForm.videoUrl" class="text-info" :href="logForm.videoUrl" target="_blank"
            >Watch Video</a
          >
          <span v-else class="text-muted">No video available</span>

          <!-- Button to remove video -->
          <v-btn v-if="logForm.videoUrl" @click="removeVideo" color="error" text
            >Remove Video</v-btn
          >
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog" color="grey" text>Cancel</v-btn>
          <v-btn @click="updateLog()" color="primary">Update</v-btn>
          <!-- Only update -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn @click="openAddDialog" color="primary" class="mt-4" disabled>Add New Swim Log</v-btn>
    <!-- Disabled Add New button -->
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  swimLogs,
  currentPage,
  dialog,
  logForm,
  openEditDialog,
  closeDialog,
  updateLog,
  deleteLog,
  handleVideoUpload,
  removeVideo,
  playVideo,
  pauseVideo,
  fetchLogs
} from '@/composables/Entries.js'
import Pagination from '../components/Pagination.vue'

// Sample stock video and thumbnail (placeholders)
const stockVideo = './src/assets/video.mp4'
const stockThumbnail = 'https://www.example.com/stock-thumbnail.jpg'

// Function to get a video thumbnail URL (could use an external service)
const getThumbnail = (videoUrl) => {
  // Logic to generate or fetch the thumbnail for the video
  return `${videoUrl.replace('.mp4', '.jpg')}`
}

const swimStyle = ['Breast', 'Free', 'Back', 'Medley']
const courseLength = ['25', '50']
const timeOfDay = ['Morning', 'Midday', 'Evening']

const totalPages = computed(() => Math.ceil(swimLogs.value.length / 6))
const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * 6
  return swimLogs.value.slice(start, start + 6)
})

onMounted(fetchLogs)
</script>

<style lang="scss" scoped>
/* General Styles */
body {
  font-family: var(--body-font-family);
  margin: 0;
  padding: 0;
  background-color: var(--light-color); // Overall background
}

/* Title */
h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--heading-color);
  font-family: var(--heading-font-family);
  margin: 1.5rem 0; // Space above and below the title
  text-align: center; // Center align the title for better UX
}

/* Swim Log Card Styles */
.log-title {
  font-size: 1.5rem; /* Increased font size for better readability */
  margin-bottom: 0.5rem; /* Space below title */
}

.log-content {
  font-size: 1rem; /* Base font size for log content */
  line-height: 1.5; /* Improved line height for readability */
  padding: 1.5rem; /* Adjusted padding for content */
  max-height: 400px; /* Limit height to maintain layout */
  overflow: hidden; /* Hide overflow content */
  transition: max-height 0.3s ease; /* Smooth transition for expandable content */
}

.log-separator {
  border-top: 1px solid var(--muted-color); /* Separator styling */
  margin: 1rem 0; /* Spacing for separators */
}

/* Wave Effect */
.wave {
  width: 100%;
  height: 150px;
  background-color: var(--primary-color);
  margin: 0 auto;
  display: block;
  --mask: radial-gradient(46.86px at 50% calc(100% - 66px), #000 99%, #0000 101%) calc(50% - 60px) 0/120px
      100%,
    radial-gradient(46.86px at 50% calc(100% + 36px), #0000 99%, #000 101%) 50% calc(100% - 30px) /
      120px 100% repeat-x;
  -webkit-mask: var(--mask);
  mask: var(--mask);
}

/* Video Link */
.video-link {
  display: block; /* Ensure the link is a block for easier clicking */
  margin: 0.5rem 0; /* Spacing around the link */
  color: var(--info-color); /* Use the info color for the video link */
  text-decoration: underline; /* Underline for better UX */
}

/* Button Styles */
.v-btn {
  transition:
    background-color 0.3s ease,
    transform 0.2s ease; /* Smooth transition for hover effects */
}

.v-btn:hover {
  transform: scale(1.05); /* Scale button slightly on hover */
}

/* Action Row */
.action-row {
  margin-top: 1rem; /* Spacing above action buttons */
  justify-content: space-between; /* Space buttons evenly */
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .log-title {
    font-size: 1.2rem; /* Adjust title size on smaller screens */
  }
  .log-content {
    font-size: 0.9rem; /* Adjust content size on smaller screens */
  }
}

.video-cover {
  width: 100%; /* Make the video cover the entire card width */
  height: 150px; /* Maintain aspect ratio */
  object-fit: cover; /* Cover the area without distortion */
}
</style>
