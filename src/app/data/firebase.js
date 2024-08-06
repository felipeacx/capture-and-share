import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAhxmBAanHc2Ecg5X8R-RI46Q47Eni9Fd0",
  authDomain: "capture-and-share-pics.firebaseapp.com",
  projectId: "capture-and-share-pics",
  storageBucket: "capture-and-share-pics.appspot.com",
  messagingSenderId: "373885787728",
  appId: "1:373885787728:web:680ddc5a90981f73cf7b55",
  measurementId: "G-FP2SB12QG8",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default db
