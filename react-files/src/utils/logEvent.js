import { getFirestore, collection, addDoc } from "firebase/firestore";

const db = getFirestore();

/**
 * Logs a user interaction event to Firestore clickstream collection.
 * @param {string} userId - The UID of the user.
 * @param {Object} event - Event details (courseId, contentId, eventType, details).
 */
export async function logEvent(userId, event) {
  if (!userId || !event) {
    console.warn("logEvent called without required parameters");
    return;
  }


  try {
    // Get public IP
    const ipResponse = await fetch("https://api.ipify.org?format=json");
    const { ip } = await ipResponse.json();

    await addDoc(collection(db, "clickstream"), {
      userId,
      timestamp: new Date().toISOString(),
      ip,
      ...event
    });

    console.log("Event logged:", event);
  } catch (err) {
    console.error("Error logging event:", err);
  }
}