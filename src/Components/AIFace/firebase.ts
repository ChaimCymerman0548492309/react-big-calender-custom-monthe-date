// Add this line to make the file a module
export {};

// Import the functions you need from the Firebase SDKs
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (replace with your own)
const firebaseConfig = {
    apiKey: "AIzaSyDhVSn0PD8XG7r5COmqp0pAicaDYIt9lxI",
    authDomain: "ai-face-6c12c.firebaseapp.com",
    projectId: "ai-face-6c12c",
    storageBucket: "ai-face-6c12c.firebasestorage.app",
    messagingSenderId: "183243902361",
    appId: "1:183243902361:web:df56e10bd75bf2108f9708",
    measurementId: "G-QDY4FLGG8C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const firestore = getFirestore(app);