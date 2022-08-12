import { doc, setDoc } from "firebase/firestore";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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


document.addEventListener(
  "DOMContentLoaded",
  function () {
    var checkButton = document.getElementById("check");
    checkButton.addEventListener(
      "click",
      function () {
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function async (tabs) {
            var tab = tabs[0];
            console.log(tab.url);
            alert(tab.url);
            await setDoc(doc(db, "cities", "LA"), {
              name: "Los Angeles",
              state: "CA",
              country: "USA"
            });
          }
        );
      },
      false
    );
  },
  false
);
