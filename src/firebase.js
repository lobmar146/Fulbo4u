// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD2-j3Qvqdt4Rzd_dk3cupKBjMDlFG_4Ts',
  authDomain: 'fulbo4u.firebaseapp.com',
  projectId: 'fulbo4u',
  storageBucket: 'fulbo4u.appspot.com',
  messagingSenderId: '294521595334',
  appId: '1:294521595334:web:26d2a238832e95b445bec7'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth()
export const db = getFirestore(app)

if (isSignInWithEmailLink(auth, window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn')
  if (!email) {
    email = window.prompt('Please provide your email for confirmation')
  }
  signInWithEmailLink(auth, email, window.location.href)
    .then(result => {
      window.localStorage.removeItem('emailForSignIn')
    })
    .catch(error => {})
}
