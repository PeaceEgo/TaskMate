import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAOfyHju6XWLadh2nBBj5RW8kiUaav_hD4",
  authDomain: "taskmate-9e5e5.firebaseapp.com",
  projectId: "taskmate-9e5e5",
  storageBucket: "taskmate-9e5e5.appspot.com",
  messagingSenderId: "12561191437",
  appId: "1:12561191437:web:0811d37ded223489213b44",
  measurementId: "G-T5PQCCC954"
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export default App;

// Additionally export the initializeApp function if needed
// export { initializeApp };
