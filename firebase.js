// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmmImhxOpEqzYY-HdsbsoWnQ6YlnPw2xY",
  authDomain: "interview-zone-frontend.firebaseapp.com",
  projectId: "interview-zone-frontend",
  storageBucket: "interview-zone-frontend.firebasestorage.app",
  messagingSenderId: "736854862749",
  appId: "1:736854862749:web:f61685675d3f12bb839d74",
  measurementId: "G-F71EMESJ3J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
