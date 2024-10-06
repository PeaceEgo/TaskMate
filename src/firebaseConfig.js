import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDy16qf81oAapIXTSqcLcmOfiLzxHG-9LU",
  authDomain: "taskmate-8765f.firebaseapp.com",
  projectId: "taskmate-8765",
  storageBucket: "//taskmate-8765f.appspot.com",
  messagingSenderId: "1084470718602",
  appId: "AIzaSyDy16qf81oAapIXTSqcLcmOfiLzxHG-9LU"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
