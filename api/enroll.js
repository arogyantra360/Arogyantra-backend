// api/enroll.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  // ✅ Always send CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ✅ Handle OPTIONS preflight request (important for Vercel)
  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true, message: "Preflight OK" });
  }

  // ✅ Handle only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  try {
    const data = req.body;

    if (!data || !data.name) {
      return res.status(400).json({ ok: false, message: "Missing doctor data" });
    }

    // ✅ Save doctor info to Firebase
    const newRef = ref(db, "enrollments");
    await push(newRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Doctor enrolled:", data.name);
    return res.status(200).json({ ok: true, message: "Doctor enrolled successfully" });
  } catch (err) {
    console.error("🔥 Firebase error:", err);
    return res.status(500).json({ ok: false, message: err.message });
  }
}
