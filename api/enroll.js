export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const data = req.body;
  console.log("Doctor Enrollment:", data);

  res.status(200).json({ success: true, message: "Data received successfully", data });
}
