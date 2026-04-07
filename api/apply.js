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
    // 1. Save to Google Sheets first
    const sheetResponse = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        course
      })
    });

    const sheetData = await sheetResponse.json();

    // 2. Stop if duplicate
    if (!sheetData.success) {
      return res.status(400).json({
        message: sheetData.message || "Duplicate application detected"
      });
    }

    // 3. Send confirmation email to student
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

    // 4. Send admin notification to you
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Application Received",
      html: `
        <h2>New Student Application</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Course:</b> ${course}</p>
      `
    });

    return res.status(200).json({
      message: "Application submitted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Submission failed",
      error: error.message
    });
  }
}