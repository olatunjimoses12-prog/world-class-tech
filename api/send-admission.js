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
    const logoUrl =
      "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

    const whatsappLink =
      "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    // =========================
    // 🎉 EMAIL TEMPLATE
    // =========================
    const htmlBody = `
      <div style="
        font-family: Arial, sans-serif;
        background:#f4f6f8;
        padding:20px;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:#fff;
          border-radius:12px;
          padding:30px;
        ">

          <div style="text-align:center;">
            <img
              src="${logoUrl}"
              style="max-width:180px;margin-bottom:20px;"
            />
          </div>

          <h2 style="color:#0a2540;">
            🎉 Congratulations! Your Admission Has Been Approved
          </h2>

          <p>Dear <strong>${name}</strong>,</p>

          <p>
            We’re excited to welcome you to
            <strong>World Class Tech Academy</strong>
          </p>

          <p>
            <strong>Cohort:</strong>
            ${cohort || "Not Assigned"}
          </p>

          <p>
            Your application for
            <strong>${course}</strong>
            has been approved successfully.
          </p>

          <ul style="line-height:1.8;color:#333;">
            <li>Live online classes</li>
            <li>Practical projects</li>
            <li>Mentorship support</li>
            <li>Certification</li>
            <li>Community access</li>
          </ul>

          <p>
            All updates will be shared in the student community group.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a href="${whatsappLink}"
              style="
                background:#25D366;
                color:#fff;
                padding:14px 24px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                display:inline-block;
              ">
              💬 Join Student Community
            </a>
          </div>

          <p>
            Best regards,<br>
            <strong>Admissions Team</strong><br>
            World Class Tech Academy
          </p>

          <hr style="margin:30px 0;border:none;border-top:1px solid #eee;"/>

          <p style="font-size:12px;color:#777;text-align:center;">
            © 2026 World Class Tech Academy
          </p>

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