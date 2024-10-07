importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js");

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOfyHju6XWLadh2nBBj5RW8kiUaav_hD4",
  authDomain: "taskmate-9e5e5.firebaseapp.com",
  projectId: "taskmate-9e5e5",
  storageBucket: "taskmate-9e5e5.appspot.com",
  messagingSenderId: "12561191437",
  appId: "1:12561191437:web:0811d37ded223489213b44",
  measurementId: "G-T5PQCCC954"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/notify.png', // Use the correct path to your public folder
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
