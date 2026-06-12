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
  cohort,
  password
} = req.body || {};
console.log(req.body);

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
const logoUrl =
  "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

const whatsappLink =
  "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

const htmlBody = `
<div style="
  font-family: Arial, sans-serif;
  background:#f4f6f8;
  padding:30px;
">

  <div style="
    max-width:600px;
    margin:auto;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 10px 25px rgba(0,0,0,0.08);
  ">

    <!-- HEADER -->
    <div style="background:#0a2540;padding:25px;text-align:center;">
      <img src="${logoUrl}" style="max-width:150px;" />
    </div>

    <!-- BODY -->
    <div style="padding:28px;color:#111827;line-height:1.6;">

      <h2 style="color:#0a2540;margin-bottom:12px;">
        🎉 Congratulations ${name}, You’ve Been Selected!
      </h2>

      <p>
        Dear <strong>${name}</strong>,
      </p>

      <p>
        We are pleased to inform you that you have been
        <strong>officially selected</strong> into
        <strong>World Class Tech Academy</strong>.
      </p>

      <div style="
        background:#fff7ed;
        padding:12px;
        border-radius:10px;
        border-left:4px solid #f97316;
        margin:18px 0;
      ">
        <p style="margin:0;">
          🎓 You have been awarded an <strong>80% SCHOLARSHIP</strong> for this program.
        </p>
      </div>

      <p>
        This selection reflects your potential, and we are excited to have you join a group of learners committed to building real tech skills.
      </p>

      <!-- DETAILS -->
      <div style="
        background:#f8fafc;
        padding:14px;
        border-radius:10px;
        margin:20px 0;
        border-left:4px solid #0a2540;
      ">
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Cohort:</strong> ${cohort || "Not Assigned Yet"}</p>
        <p><strong>Status:</strong> Admission Confirmed</p>
      </div>

      <h3 style="color:#0a2540;margin-top:20px;">
        What’s Included in Your Program
      </h3>

      <ul style="padding-left:18px;color:#333;line-height:1.7;">
        <li>Live instructor-led training</li>
        <li>Real-world hands-on projects</li>
        <li>Mentorship & career support</li>
        <li>Certification upon completion</li>
        <li>Class Data Support & learning resources</li>
        <li>Private student community access</li>
      </ul>

      <div style="
        text-align:center;
        margin:25px 0;
      ">
        <a href="${whatsappLink}"
          style="
            background:#25D366;
            color:#fff;
            padding:13px 22px;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
            display:inline-block;
          ">
          💬 Join Student Community
        </a>
      </div>

      <p>
        Please join the community to receive onboarding details, class schedule, and next steps.
      </p>
      <p><strong>Portal Login Details</strong></p>

<p>Email: ${email}</p>

<p>Password: ${password}</p>

<p>
Use these credentials to access your
student portal after payment confirmation.
</p>

      <p style="margin-top:25px;">
        Best regards,<br>
        <strong>Admissions Team</strong><br>
        World Class Tech Academy
      </p>

    </div>

    <!-- FOOTER -->
    <div style="
      background:#f1f5f9;
      text-align:center;
      padding:12px;
      font-size:12px;
      color:#6b7280;
    ">
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