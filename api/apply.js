import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, phone, course } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Application Received",
      html: `
        <h2>World Class Tech Academy</h2>
        <p>Hello ${name},</p>
        <p>Your application for <b>${course}</b> has been received.</p>
        <p>Phone: ${phone}</p>
        <p>We will contact you soon.</p>
      `
    });

    return res.status(200).json({
      message: "Success"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Email failed",
      error: error.message
    });
  }
}