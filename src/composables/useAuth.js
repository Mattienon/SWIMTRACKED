import { ref } from 'vue';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useRouter } from 'vue-router';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const email = ref("");
  const password = ref("");
  const errMsg = ref("");
  const currentUser = ref(null);
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Fetch user data from Firestore and assign it to `currentUser`
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentUser.value = { uid: user.uid, ...userDoc.data() }; // Set user data from Firestore
      } else {
        currentUser.value = user; // Fallback to Firebase Auth user object
      }
    } else {
      currentUser.value = null;
    }
  });

  const resetErrMsg = () => {
    errMsg.value = "";
  };

  const register = async (firstName, email, password) => {
    resetErrMsg();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("User created:", user);

      try {
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName: "",  // Set a default empty string for lastName or pass it from component
          email,
        });
        console.log("User data saved in Firestore!");
      } catch (firestoreError) {
        console.error("Error saving user data to Firestore:", firestoreError);
        errMsg.value = "Failed to save user data to the database.";
      }

      router.push('/');
    } catch (error) {
      console.error("Registration error:", error);
      handleAuthError(error);
    }
  };

  const signIn = async () => {
    resetErrMsg();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;

      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentUser.value = { uid: user.uid, ...userDoc.data() }; // Update `currentUser` with Firestore data
      }

      console.log("Successfully signed in!", user);
      router.push('/');
    } catch (error) {
      console.error(error.code);
      handleAuthError(error);
    }
  };

  const signInWithGoogle = async () => {
    resetErrMsg();
    
    // Initialize the Google provider
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account' // Force the account selection prompt every time
    });
  
    try {
      // Optionally sign the user out before initiating Google sign-in
      await auth.signOut(); // Ensure no previous session exists
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Continue with Firestore data logic...
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        currentUser.value = { uid: user.uid, ...userDoc.data() };
      } else {
        await setDoc(doc(db, "users", user.uid), {
          firstName: user.displayName.split(" ")[0],
          lastName: user.displayName.split(" ")[1] || "",
          email: user.email,
        });
        currentUser.value = { uid: user.uid, firstName: user.displayName.split(" ")[0], email: user.email };
      }
  
      console.log("Successfully registered or signed in with Google!", user);
      router.push('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
      handleAuthError(error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      console.log("Successfully signed out!");
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        errMsg.value = "Invalid email format.";
        break;
      case "auth/user-not-found":
        errMsg.value = "No account with that email was found.";
        break;
      case "auth/wrong-password":
        errMsg.value = "Incorrect password.";
        break;
      default:
        errMsg.value = "Issue with Email or Password. Please try again.";
        break;
    }
  };

  return {
    email,
    password,
    errMsg,
    currentUser,
    register,
    signIn,
    signInWithGoogle, // Expose Google Sign-In function
    logOut,
  };
}