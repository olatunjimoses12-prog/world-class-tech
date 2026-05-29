import nodemailer from "nodemailer";

export default async function handler(req, res) {

  // =========================
  // ✅ CORS HEADERS
  // =========================
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // =========================
  // ✅ HANDLE PRE-FLIGHT
  // =========================
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // =========================
  // ✅ ONLY POST ALLOWED
  // =========================
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {

    // =========================
    // ✅ SAFE BODY DESTRUCTURE
    // =========================
    const {
      name,
      email,
      course,
      cohort
    } = req.body || {};

    console.log("BODY RECEIVED:", req.body);

    // =========================
    // ✅ VALIDATION
    // =========================
    if (!email || !name || !course) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // =========================
    // ✅ SMTP TRANSPORTER
    // =========================
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // =========================
    // ✅ VERIFY SMTP
    // =========================
    await transporter.verify();
    console.log("SMTP VERIFIED SUCCESSFULLY");

    // =========================
    // ✅ STATIC LINKS
    // =========================
    const htmlBody = `
<div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:30px;">

  <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

    <!-- HEADER -->
    <div style="background:#0a2540;padding:25px;text-align:center;">
      <img src="${logoUrl}" style="max-width:160px;" />
    </div>

    <!-- BODY -->
    <div style="padding:30px;color:#111827;line-height:1.7;">

      <h2 style="color:#0a2540;margin-bottom:10px;">
        🎉 Admission Approved
      </h2>

      <p style="font-size:16px;">
        Dear <strong>${name}</strong>,
      </p>

      <p>
        Congratulations! Your application to
        <strong>World Class Tech Academy</strong>
        has been successfully reviewed and approved.
      </p>

      <!-- DETAILS BOX -->
      <div style="background:#f8fafc;padding:15px;border-radius:10px;margin:20px 0;">
        <p style="margin:5px 0;"><strong>Course:</strong> ${course}</p>
        <p style="margin:5px 0;"><strong>Cohort:</strong> ${cohort || "Not Assigned"}</p>
        <p style="margin:5px 0;"><strong>Status:</strong> Approved</p>
      </div>

      <p>
        You are now officially part of our scholarship-supported learning program.
      </p>

      <h3 style="margin-top:25px;">What you get:</h3>

      <ul style="padding-left:18px;color:#333;">
        <li>Live instructor-led classes</li>
        <li>Real-world projects</li>
        <li>Mentorship & guidance</li>
        <li>Certification upon completion</li>
        <li>Private student community access</li>
      </ul>

      <!-- CTA BUTTON -->
      <div style="text-align:center;margin:30px 0;">
        <a href="${whatsappLink}"
          style="background:#25D366;color:white;padding:14px 22px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">
          💬 Join Student Community
        </a>
      </div>

      <p>
        Please ensure you join the community to receive class updates, schedules, and onboarding instructions.
      </p>

      <p style="margin-top:30px;">
        Best regards,<br>
        <strong>Admissions Team</strong><br>
        World Class Tech Academy
      </p>

    </div>

    <!-- FOOTER -->
    <div style="background:#f1f5f9;text-align:center;padding:15px;font-size:12px;color:#6b7280;">
      © 2026 World Class Tech Academy • All rights reserved
    </div>

  </div>
</div>
`;

    // =========================
    // ✅ SEND EMAIL
    // =========================
    const info = await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Admission Approved - World Class Tech Academy",
      html: htmlBody
    });

    console.log("EMAIL SENT:", info.messageId);

    // =========================
    // ✅ RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message: "Admission email sent successfully"
    });

  } catch (error) {

    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}