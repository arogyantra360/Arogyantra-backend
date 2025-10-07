import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  // ✅ CORS fix
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // preflight request handled
  }

  // ✅ Allow only POST method
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    // ✅ Data from frontend
    const data = req.body;

    if (!data.name || !data.email) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    // ✅ Push to Firebase Realtime DB
    const newRef = ref(db, "enrollments");
    await push(newRef, data);

    // ✅ Success response
    res.status(200).json({
      ok: true,
      message: "Doctor enrolled successfully 🩺",
      data,
    });
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ ok: false, message: error.message });
  }
}
