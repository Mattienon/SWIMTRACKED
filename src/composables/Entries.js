import { ref } from 'vue';
import { swimLogService } from '@/composables/swimLogService.js';
import { getAuth } from 'firebase/auth';
import { uploadFile } from '@/firebase.config.js';

// Refs for form and state management
export const swimLogs = ref([]);
export const currentPage = ref(1);
export const itemsPerPage = 6; // Pagination: 6 items per page
export const dialog = ref(false);
export const isEditing = ref(false);

export const logForm = ref({
  courseLength: '',
  distance: '',
  swimStyle: [],
  timeOfDay: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  videoUrl: ''
});

// Fetch logs and ensure each log has `show: false` to hide details by default
export const fetchLogs = async () => {
  const user = getAuth().currentUser;
  if (user) {
    try {
      const logs = await swimLogService.getLogsForUser(user.uid);
      swimLogs.value = logs.map(log => ({ ...log, show: false }))
                          .sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  } else {
    console.error('No authenticated user found');
  }
};

// Open Add Dialog
export const openAddDialog = () => {
  isEditing.value = false;
  logForm.value = {
    courseLength: '',
    distance: '',
    swimStyle: [],
    timeOfDay: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    videoUrl: ''
  };
  dialog.value = true;
};

// Close Dialog
export const closeDialog = () => {
  dialog.value = false;
};

// Open Edit Dialog
export const openEditDialog = (log) => {
  isEditing.value = true;
  logForm.value = { ...log }; // Pre-fill form with selected log data
  dialog.value = true;
};

// Add a log
export const addLog = async () => {
  const user = getAuth().currentUser;
  if (user) {
    try {
      await swimLogService.addLog({ ...logForm.value, swimStyle: logForm.value.swimStyle }, user.uid);
      await fetchLogs(); // Refresh logs after adding
      closeDialog();
    } catch (error) {
      console.error('Error adding log:', error);
    }
  } else {
    console.error('No authenticated user found');
  }
};

// Update a log
export const updateLog = async () => {
  const user = getAuth().currentUser;
  if (user && logForm.value.id) {
    try {
      await swimLogService.updateLog(logForm.value.id, { ...logForm.value, swimStyle: logForm.value.swimStyle });
      await fetchLogs(); // Refresh logs after updating
      closeDialog(); // Close dialog after update
      console.log('Log updated successfully.');
    } catch (error) {
      console.error('Error updating log:', error);
    }
  } else {
    console.error('No authenticated user found or log ID missing');
  }
};

// Delete a log
export const deleteLog = async (id) => {
  const confirmed = confirm('Are you sure you want to delete this log?');
  if (confirmed) {
    try {
      await swimLogService.deleteLog(id); // Delete log by ID
      await fetchLogs(); // Refresh logs after deletion
      console.log('Log deleted successfully.');
    } catch (error) {
      console.error('Error deleting log:', error);
    }
  }
};

// Video Upload
export const handleVideoUpload = async (event) => {
  const file = event.target.files[0];
  const user = getAuth().currentUser;
  if (file && user) {
    try {
      const downloadURL = await uploadFile(file, user.uid);
      logForm.value.videoUrl = downloadURL;
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  } else if (!file) {
    console.error("No file provided for upload.");
  } else {
    console.error("No authenticated user found.");
  }
};

// Remove Video
export const removeVideo = () => {
  logForm.value.videoUrl = ''; // Clear the video URL
};

// Play/Pause Video on Hover
export const playVideo = (event) => {
  const videoElement = event.target;
  videoElement.play();
};

export const pauseVideo = (event) => {
  const videoElement = event.target;
  videoElement.pause();
};