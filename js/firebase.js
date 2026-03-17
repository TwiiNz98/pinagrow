/* ══════════════════════════════════════════════
   PIÑA GROWSHOP — js/firebase.js
   Firebase v10 Modular SDK (type="module")
   Puente hacia scripts clásicos via window.*
   ══════════════════════════════════════════════ */

import { initializeApp }                    from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ── Configuración Firebase ── */
const firebaseConfig = {
  apiKey:            "AIzaSyB-At3w0mcAg7rQBE8gAkBH1hdInDd9Pbc",
  authDomain:        "pina-growshop.firebaseapp.com",
  projectId:         "pina-growshop",
  storageBucket:     "pina-growshop.firebasestorage.app",
  messagingSenderId: "136048074141",
  appId:             "1:136048074141:web:f0a84efffec73128402374",
  measurementId:     "G-FB3ZM9G9YB"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ── Exponer instancia y métodos al scope global ── */
window.db_cloud = db;
window.firestoreModular = {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, getDoc, getDocs, serverTimestamp
};

/* ── Notificar a scripts clásicos que Firebase está listo ── */
window.dispatchEvent(new CustomEvent("firebase-ready"));
