import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  // ✅ Add CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end(); // stop here, no error
  }

  // ✅ Handle only POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const data = req.body;
    console.log("Received data:", data);

    if (!data.name || !data.email) {
      return res.status(400).json({ ok: false, message: "Missing name or email" });
    }

    // ✅ Save in Firebase
    const newRef = ref(db, "enrollments");
    await push(newRef, data);

    return res.status(200).json({ ok: true, message: "Doctor enrolled successfully ✅" });
  } catch (err) {
    console.error("Error saving to Firebase:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}
