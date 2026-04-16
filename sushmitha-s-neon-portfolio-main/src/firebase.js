import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyByFgfzIF22sLFo_qLEU7TbVWn3zZ6-nYA",
  authDomain: "portfolio-b0d49.firebaseapp.com",
  databaseURL: "https://portfolio-b0d49-default-rtdb.firebaseio.com",
  projectId: "portfolio-b0d49",
  storageBucket: "portfolio-b0d49.firebasestorage.app",
  messagingSenderId: "6273681463",
  appId: "1:6273681463:web:9be242b5e5de9b2ae857b2"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
