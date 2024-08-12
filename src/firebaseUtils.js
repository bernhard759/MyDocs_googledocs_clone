import { collection, query, where, getDocs } from "firebase/firestore";
import { setDoc, doc } from "firebase/firestore";
import { auth, database } from "./firebaseConfig";

// Save to firestore db
export const saveUserToFirestore = async (user) => {
  const userRef = doc(database, "users", user.uid);
  await setDoc(userRef, {
    email: user.email,
    name: user.displayName || "Noname",
  });
};

// Auth listener to save user to database when auth state changes
auth.onAuthStateChanged((user) => {
    if (user) {
      saveUserToFirestore(user);
    }
  });