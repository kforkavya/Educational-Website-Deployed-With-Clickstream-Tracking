import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCuyDxJShrwnx75KYYMYm2geyiVEajgtLU",
  authDomain: "et617-web-dev-assignment.firebaseapp.com",
  projectId: "et617-web-dev-assignment",
  storageBucket: "et617-web-dev-assignment.firebasestorage.app",
  messagingSenderId: "206092946756",
  appId: "1:206092946756:web:c30639b669f2bd47985b11",
  measurementId: "G-3FT6YDD65L"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);