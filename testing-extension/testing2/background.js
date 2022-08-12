import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCuYgNSkxi19v7GNuOX2F_EpGT4ElhR_xg",
  authDomain: "chat-app-ae447.firebaseapp.com",
  projectId: "chat-app-ae447",
  storageBucket: "chat-app-ae447.appspot.com",
  messagingSenderId: "270428664328",
  appId: "1:270428664328:web:d9368a423d9612df9f17bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
console.log("firebase initialized");

(() => {
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    if (type === "Favorite") {
      console.log("favorite");
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs[0].url);
        (async () => {
          const messages = await collection(db, "lol");
          console.log("messages collection initialized");

          const message = {
            text: tabs[0].url,
            timestamp: new Date(),
          };

          await addDoc(messages, message);
          console.log("message added");
          console.log(auth.currentUser);

          if (auth.currentUser) {
          } else {
            chrome.runtime.sendMessage({
              type: "signIn",
              a: { auth, provider, signInWithPopup },
            });
          }
        })();
      });
    } else if (type === "Later") {
      console.log("later");
    }
    if (type === "signIn") {
      console.log("it's happening");
      createUserWithEmailAndPassword(auth, obj.email, obj.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
          // ..
        });
      chrome.storage.sync.set({
        key: auth.currentUser,
      });
      response({
        type: "signIn",
        user: auth.currentUser,
      });
    }
  });
})();
