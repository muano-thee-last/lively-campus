import { app } from "../Login/config";
import { getMessaging, getToken } from "firebase/messaging";

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
const uid = sessionStorage.getItem("uid"); // Assuming the user ID is stored in session storage

// Function to get the FCM token and send it to the backend for storage
async function saveFcmToken() {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BJXnaJMiLjxe0s5X7SiwhWsAP4beRPb4-Zgpga3s-DpI9_bZH62Lm_CIaql-TfrqTrSDwddSdqWDiyKx_1L9Wcc", // Replace with your actual VAPID key
    });

    if (currentToken) {
      console.log("FCM Token generated:", currentToken);

      // Send the token to your backend or Firebase Function to store it
      const response = await fetch(
        "https://us-central1-witslivelycampus.cloudfunctions.net/app/saveFcmToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            fcmToken: currentToken,
          }),
        }
      );

      if (response.ok) {
        console.log("FCM Token saved successfully to the server.");
      } else {
        console.error("Failed to save the FCM token to the server.");
      }
    } else {
      console.log("No registration token available.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving the token: ", err);
  }
}

// Function to request permission for notifications and then get/save the token
export async function requestPermissionAndSaveToken() {
  console.log("Requesting notification permission...");

  // Request permission from the user
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    await saveFcmToken(); // Call the function to get and save the FCM token
  } else {
    console.log("Notification permission denied.");
  }
}
