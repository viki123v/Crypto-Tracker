import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAqjwJV58iW5gO_MBkh2fjNPdemyW7lIn0",
    authDomain: "proba123-8f493.firebaseapp.com",
    databaseURL: "https://proba123-8f493-default-rtdb.firebaseio.com",
    projectId: "proba123-8f493",
    storageBucket: "proba123-8f493.appspot.com",
    messagingSenderId: "120255014752",
    appId: "1:120255014752:web:b09e1b4eafbc17bd066005",
    measurementId: "G-V3JCHCBK1R"

};

const app = initializeApp( firebaseConfig )
export const fireStore = getFirestore( app )
export const fireAuth = getAuth( app )

