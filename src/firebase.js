// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/firestore");

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD4PVVS6e00IeD21DVivQNL4P187Y2ZIvg",
    authDomain: "angular-ionic-crud-506e0.firebaseapp.com",
    databaseURL: "https://angular-ionic-crud-506e0.firebaseio.com",
    projectId: "angular-ionic-crud-506e0",
    storageBucket: "angular-ionic-crud-506e0.appspot.com",
    messagingSenderId: "381443052328",
    appId: "1:381443052328:web:1ddc23f3fb24c4bf"
  };
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);