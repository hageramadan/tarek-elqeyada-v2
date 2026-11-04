// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Config بتاعك
const firebaseConfig = {
  apiKey: "AIzaSyDCB3S8v8w_yAP3bbKHn9B1fJOFYcoJLFQ",
  authDomain: "tariqalqeyada.firebaseapp.com",
  projectId: "tariqalqeyada",
  storageBucket: "tariqalqeyada.firebasestorage.app",
  messagingSenderId: "928553256087",
  appId: "1:928553256087:web:a045aed807a8e46bff15d2",
  measurementId: "G-ZQR3REP4KX"
};

// منع إعادة تهيئة Firebase في الـ Server Side (مهم لـ Next.js)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// تصدير الـ auth عشان تستخدمه في الـ hooks
export { app, auth };
