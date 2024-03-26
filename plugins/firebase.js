// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { collection, query, getFirestore, onSnapshot, getDocs, getDoc, doc, startAfter, where, deleteDoc, addDoc, updateDoc } from 'firebase/firestore'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: process.env.AUTH_DOMAIN_FIREBASE,
  projectId: process.env.PROJECT_ID_FIREBASE,
  storageBucket: process.env.STORAGEBUCKET_FIREBASE,
  messagingSenderId: process.env.MESAGINGSENDERID_FIREBASE,
  appId: process.env.APPID_FIREBASE,
  measurementId: process.env.MEASUREMENTID_FIREBASE
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const authentication = getAuth(app)

export { db, collection, query, authentication, onSnapshot, getDocs, getDoc, doc, startAfter, where, signInWithEmailAndPassword, getAuth, deleteDoc, addDoc, updateDoc }
