// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBJ1DNcSfhxmPnNpaMIyvfwl6rEz7dPzaw',
  authDomain: 'house-marketplace-1422d.firebaseapp.com',
  projectId: 'house-marketplace-1422d',
  storageBucket: 'house-marketplace-1422d.appspot.com',
  messagingSenderId: '1096002544631',
  appId: '1:1096002544631:web:930f73a821e258d09bc4f2',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
