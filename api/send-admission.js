import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  try {

    const { name, email, course } = req.body || {};

    if (!email || !name || !course) {
      return res.status(400).json({
        success: false,
        message: "Missing fields"
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Admission Approved",
      html: `
        <h2>Congratulations ${name} 🎉</h2>
        <p>Your admission for <b>${course}</b> has been approved.</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: "Email sent"
    });

  } catch (error) {

    console.error("EMAIL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}