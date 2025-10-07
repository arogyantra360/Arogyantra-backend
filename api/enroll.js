import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";
import firebaseConfig from "../firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const data = req.body;
    const newRef = ref(db, "enrollments");
    await push(newRef, data);
    res.status(200).json({ success: true, message: "Doctor enrolled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
