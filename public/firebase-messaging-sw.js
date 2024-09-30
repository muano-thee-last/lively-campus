/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Import Firebase scripts required for messaging
importScripts("https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging.js"
);

// Initialize Firebase app with your config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "witslivelycampus.firebaseapp.com",
  databaseURL: "https://witslivelycampus-default-rtdb.firebaseio.com",
  projectId: "witslivelycampus",
  storageBucket: "witslivelycampus.appspot.com",
  messagingSenderId: "61229245877",
  appId: "1:61229245877:web:44c304d1f7eed94b9065fc",
};

// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // You can add your custom icon here
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Handle foreground messages (if you want to customize it in the service worker)
self.addEventListener("push", function (event) {
  if (event.data) {
    const payload = event.data.json();
    console.log("Received foreground message: ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/firebase-logo.png", // Your custom icon
    };

    // Show notification
    event.waitUntil(
      self.registration.showNotification(notificationTitle, notificationOptions)
    );
  }
});

// Handle notification click (optional)
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow("https://yourwebsite.com") // Customize this to redirect to your app
  );
});
