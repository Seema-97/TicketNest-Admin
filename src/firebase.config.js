// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVSqZoENzbmjZ_s6wpGTZdY9SywbY9mDk",
  authDomain: "ticketnest-35ce3.firebaseapp.com",
  projectId: "ticketnest-35ce3",
  storageBucket: "ticketnest-35ce3.appspot.com",
  messagingSenderId: "921797971651",
  appId: "1:921797971651:web:b42b4b4f518772627e5c76"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

export const APP = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig) ;

export const fireStoreDb = getFirestore(APP) ;

export const auth = getAuth()