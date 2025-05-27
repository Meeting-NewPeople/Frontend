// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQpB2JxuchYEw1wVvFf50Z503jTdPn6xk",
  authDomain: "meeting-7dbfc.firebaseapp.com",
  projectId: "meeting-7dbfc",
  storageBucket: "meeting-7dbfc.firebasestorage.app",
  messagingSenderId: "240394510534",
  appId: "1:240394510534:web:62f32b1212328fb1aaf7c7",
  measurementId: "G-68MC3LPLG5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);         // ✅ 이 줄 추가해야 Firebase Auth 사용 가능