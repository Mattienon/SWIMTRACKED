// userService.js
import { db } from '@/firebase.config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const userService = {
  // Fetch user data by user ID
  getUserData: async (uid) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      } else {
        console.error("No such user!");
        return null; // Or return an appropriate value to indicate no user found
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
      throw error; // Rethrow to handle in the component
    }
  },
// Create a new user document in Firestore
createUserData: async (uid, userData) => {
  try {
    const userRef = doc(db, 'users', uid); // Reference to the user's document
    await setDoc(userRef, userData); // Write the user data to Firestore

    console.log("Firestore user data created for UID:", uid); // Debugging log
  } catch (error) {
    console.error("Error creating user data in Firestore:", error);
    throw error; // Rethrow to handle in the component
  }
},

  // Update user data including goals
  updateUserData: async (uid, userData) => {
    try {
      const userRef = doc(db, 'users', uid);
      // Check if user exists before updating
      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        throw new Error("User does not exist.");
      }
      await updateDoc(userRef, userData); // Update user data
    } catch (error) {
      console.error("Error updating user data: ", error);
      throw error;
    }
  },

    // Save user goals separately if needed
    saveGoals: async (uid, goals, swimGoals, targetSwimLogs, weeklySwimGoal) => {
      try {
        await updateDoc(doc(db, 'users', uid), {
          goals,
          swimGoals,
          targetSwimLogs,
          weeklySwimGoal,
        });
      } catch (error) {
        console.error("Error saving goals:", error);
        throw error;
      }
    },


};

export { userService };