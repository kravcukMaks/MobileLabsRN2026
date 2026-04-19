import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBENX9jdvDdmgFfGsYXbNoZZRGVmY8uLLA",
  authDomain: "lab6-5a75d.firebaseapp.com",
  projectId: "lab6-5a75d",
  storageBucket: "lab6-5a75d.firebasestorage.app",
  messagingSenderId: "633741886663",
  appId: "1:633741886663:web:07128db1cc97ff23f0eae2",
  measurementId: "G-C73P1ZN9Z1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
