import { initializeApp, getApps } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

// Prevent re-initializing Firebase multiple times
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  try {
    const data = req.body;

    if (!data || !data.name) {
      return res.status(400).json({ ok: false, message: "Missing doctor name" });
    }

    const newRef = ref(db, "enrollments");
    await push(newRef, { ...data, createdAt: new Date().toISOString() });

    return res.status(200).json({ ok: true, message: "Doctor enrolled successfully 🩺" });
  } catch (error) {
    console.error("🔥 Firebase error:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
}
