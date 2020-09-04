import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCzXnyYLF1QNjJfImq7a93TdgKtszFkpR8",
    authDomain: "instagram-clone-5b53f.firebaseapp.com",
    databaseURL: "https://instagram-clone-5b53f.firebaseio.com",
    projectId: "instagram-clone-5b53f",
    storageBucket: "instagram-clone-5b53f.appspot.com",
    messagingSenderId: "440227663676",
    appId: "1:440227663676:web:7f9a3ab88214d8f8341839",
    measurementId: "G-T57RE8FE4Q"
  };

const myFirebase = firebase.initializeApp(firebaseConfig);
const db = myFirebase.firestore();
const auth = myFirebase.auth();
const storage = myFirebase.storage();

export {db, auth, storage };