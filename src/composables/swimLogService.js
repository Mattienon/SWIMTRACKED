import { db } from '@/firebase.config';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc // Ensure this is imported for getLogById
} from 'firebase/firestore';

const swimLogService = {
  // Fetch swim logs for a specific user
  getLogsForUser: async (userId) => {
    const logsRef = collection(db, 'swimLogs');
    const q = query(logsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  // Add a new log
  addLog: async (log, userId) => {
    try {
      const logsCollection = collection(db, 'swimLogs');
      await addDoc(logsCollection, { ...log, userId }); // Include userId with the log
      console.log('Log added successfully.');
    } catch (error) {
      console.error("Error adding log: ", error);
      throw error; // Rethrow error for further handling
    }
  },

  // Update an existing log
  updateLog: async (id, log) => {
    try {
      const logRef = doc(db, 'swimLogs', id);
      await updateDoc(logRef, log);
      console.log('Log updated successfully.');
    } catch (error) {
      console.error("Error updating log: ", error);
      throw error; // Rethrow error for further handling
    }
  },

  // Delete a log by ID
  deleteLog: async (id) => {
    try {
      const logRef = doc(db, 'swimLogs', id);
      await deleteDoc(logRef);
      console.log('Log deleted successfully.');
    } catch (error) {
      console.error("Error deleting log: ", error);
      throw error; // Rethrow error for further handling
    }
  },

  // Delete all logs for a user
  deleteUserLogs: async (userId) => {
    try {
      const logsCollection = collection(db, 'swimLogs');
      const q = query(logsCollection, where('userId', '==', userId));
      const logsSnapshot = await getDocs(q);

      const deletePromises = logsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      const deletedCount = logsSnapshot.size; // Count of deleted logs
      await Promise.all(deletePromises);

      console.log(`${deletedCount} swim logs deleted successfully.`);
      return deletedCount; // Return the count of deleted logs
    } catch (error) {
      console.error('Error deleting swim logs:', error);
      throw error; // Rethrow error for further handling
    }
  },

  // Get a specific log by ID
  getLogById: async (id) => {
    try {
      const logRef = doc(db, 'swimLogs', id);
      const logSnapshot = await getDoc(logRef);
      if (logSnapshot.exists()) {
        return { id: logSnapshot.id, ...logSnapshot.data() };
      } else {
        console.error('No log found with ID:', id);
        return null; // Return null if the log doesn't exist
      }
    } catch (error) {
      console.error('Error fetching log:', error);
      throw error; // Propagate error for further handling
    }
  },

  // Save swim log data along with the video URL
  saveSwimLog: async (logData) => {
    try {
      const logId = doc(collection(db, 'swimLogs')).id; // Create a unique ID
      await setDoc(doc(db, 'swimLogs', logId), logData); // Use unique ID for the document
      console.log('Log saved successfully.');
    } catch (error) {
      console.error("Error saving swim log: ", error);
      throw error; // Rethrow to handle in the component
    }
  },
};

export { swimLogService };