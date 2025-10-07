import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

// Initialize Firebase safely (prevent multiple init)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default async function handler(req, res) {
  // ✅ CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).json({ ok: true });

  if (req.method !== "POST")
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });

  try {
    const data = req.body;

    if (!data.name || !data.email) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    // ✅ Save in Firebase
    const newRef = ref(db, "enrollments");
    await push(newRef, {
      ...data,
      createdAt: new Date().toISOString(),
    });

    console.log("✅ Doctor enrolled:", data.name);
    res.status(200).json({ ok: true, message: "Doctor enrolled successfully" });
  } catch (err) {
    console.error("🔥 Firebase error:", err);
    res.status(500).json({ ok: false, message: err.message });
  }
}
