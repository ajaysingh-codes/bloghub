
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUliPXqd0tNnCOMoDRYjLUCf9YL6N9ydc",
  authDomain: "blog-app-b684e.firebaseapp.com",
  projectId: "blog-app-b684e",
  storageBucket: "blog-app-b684e.appspot.com",
  messagingSenderId: "812171752329",
  appId: "1:812171752329:web:7a8d2990dcd7e5b9e0e758"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
