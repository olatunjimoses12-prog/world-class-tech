import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // ONLY POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {
    const { name, email, course } = req.body || {};

    // VALIDATION (IMPORTANT)
    if (!name || !email || !course) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // SMTP TRANSPORT
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const logoUrl =
      "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

    const whatsappLink =
      "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    // FULL EMAIL (IMPROVED + CLEAN)
    const htmlBody = `
      <div style="font-family:Arial;background:#f4f6f8;padding:20px">
        <div style="max-width:600px;margin:auto;background:#fff;padding:25px;border-radius:10px">

          <div style="text-align:center">
            <img src="${logoUrl}" style="max-width:160px"/>
          </div>

          <h2>🎉 Admission Approved</h2>

          <p>Dear <b>${name}</b>,</p>

          <p>Your admission into <b>${course}</b> has been approved.</p>

          <p>You are now officially part of <b>World Class Tech Academy</b>.</p>

          <ul>
            <li>Live classes</li>
            <li>Projects</li>
            <li>Mentorship</li>
            <li>Certification</li>
          </ul>

          <p style="margin-top:20px">
            Join community:
          </p>

          <a href="${whatsappLink}"
            style="display:inline-block;padding:12px 20px;background:#25D366;color:#fff;border-radius:8px;text-decoration:none">
            Join WhatsApp
          </a>

          <p style="margin-top:30px">– Admissions Team</p>

        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Admission Approved",
      html: htmlBody
    });

    return res.status(200).json({
      success: true,
      message: "Admission email sent successfully"
    });

  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Email failed",
      error: error.message
    });
  }
}