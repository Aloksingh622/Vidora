import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "padho-c6404.firebaseapp.com",
  projectId: "padho-c6404",
  storageBucket: "padho-c6404.firebasestorage.app",
  messagingSenderId: "410605103943",
  appId: "1:410605103943:web:f669bf72766ea2ef9cba62",
  measurementId: "G-N02E5SZV43"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth,provider}