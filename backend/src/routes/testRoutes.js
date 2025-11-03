import express from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "mkhmkh1130@yahoo.com",
      "Test Email from Mega Mart",
      "This is a plain text email.",
      "<h1>Hello from <b>Mega Mart</b>!</h1><p>Your email setup works 🎉</p>"
    );
    res.json({ success: true, message: "Test email sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
