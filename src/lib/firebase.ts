// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "voiceguard-ai",
  "appId": "1:778479144394:web:0cd06ec3024b7592fe9333",
  "storageBucket": "voiceguard-ai.firebasestorage.app",
  "apiKey": "AIzaSyCkNfaJa3TVwOn28v4b0sMJrz-nrfwCFr8",
  "authDomain": "voiceguard-ai.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "778479144394"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
