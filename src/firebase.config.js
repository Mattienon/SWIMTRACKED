// firebase.config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_DATABASE_URL,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_APP_ID,
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Ensure the storage is initialized with the app

// Function to upload a file to the swimLogs/videos folder
const uploadFile = async (file, userId) => {
  if (!file) {
    console.error("No file provided for upload.");
    return;
  }

  // Create a reference to the swimLogs/videos folder in storage
  const storageRef = ref(storage, `swimLogs/videos/${userId}/${file.name}`);

  try {
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    console.log('Uploaded a blob or file!', snapshot);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at', downloadURL);
    return downloadURL; // Return the download URL for further use
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};


// Export Firestore, Auth, and upload functions for other parts of your app
export { db, auth, uploadFile };