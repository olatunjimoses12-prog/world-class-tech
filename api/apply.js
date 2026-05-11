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
    // 1. Send data to Google Sheets
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

    const rawText = await sheetResponse.text();
    const sheetData = JSON.parse(rawText);

    // 2. Stop if duplicate
    if (!sheetData.success) {
      return res.status(400).json({
        message: sheetData.message || "Duplicate application detected"
      });
    }

    // 🔥 EMAIL TEMPLATE (EXTRACTED + UPGRADED)
    const logoUrl = "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";
    const whatsappLink = "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    const studentHtml = `
    <div style="font-family:Arial,sans-serif; background:#f4f6f8; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; padding:30px;">
        
        <div style="text-align:center;">
          <img src="${logoUrl}" style="max-width:180px; margin-bottom:20px;">
        </div>

        <h2 style="color:#0a2540;">Application Received 🎉</h2>

        <p>Dear <strong>${name}</strong>,</p>

        <p>
          Thank you for applying to <strong>World Class Tech Academy</strong>.
          We have successfully received your application for 
          <strong>${course}</strong>.
        </p>

        <p>
          Our admissions team will contact you within 
          <strong>3–5 business days</strong>.
        </p>

        <div style="text-align:center; margin:25px 0;">
          <a href="${whatsappLink}"
             style="background:#25D366; color:#ffffff; padding:14px 24px;
             text-decoration:none; border-radius:6px; font-weight:bold;">
            💬 Join WhatsApp Group
          </a>
        </div>

        <p>
          Best regards,<br>
          <strong>Admissions Team</strong><br>
          World Class Tech Academy
        </p>

        <hr style="margin:30px 0;">

        <p style="font-size:12px; color:#666;">
          This is an automated message. Please do not reply.
        </p>

      </div>
    </div>
    `;

    // 3. Send email to student
    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`
      to: email,
      subject: "✅ Application Received | World Class Tech Academy",
      html: studentHtml
    });

    // 4. Send admin notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "🚀 New Application Received",
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