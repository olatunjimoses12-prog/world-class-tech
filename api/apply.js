import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  const { name, email, phone, course } = req.body;

  // ================= EMAIL TRANSPORTER =================
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {

    // ================= SEND TO GOOGLE SHEETS =================
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

    // safer JSON handling
    let sheetData = {};

    try {
      sheetData = await sheetResponse.json();
    } catch (err) {
      console.log("Sheet response is not JSON");
    }

    // ================= DUPLICATE CHECK =================
    if (sheetData.success === false) {
      return res.status(400).json({
        message: sheetData.message || "Duplicate application detected"
      });
    }

    // ================= EMAIL TEMPLATE =================
    const logoUrl =
      "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

    const whatsappLink =
      "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    const studentHtml = `
      <div style="font-family:Arial,sans-serif;background:#f4f6f8;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#ffffff;border-radius:12px;padding:30px;">

          <div style="text-align:center;">
            <img 
              src="${logoUrl}" 
              style="max-width:180px;margin-bottom:20px;"
            />
          </div>

          <h2 style="color:#0a2540;">
            Application Successfully Received 🎉
          </h2>

          <p>Dear <strong>${name}</strong>,</p>

          <p>
            Thank you for applying to 
            <strong>World Class Tech Academy</strong>.
          </p>

          <p>
            We have successfully received your application for 
            <strong>${course}</strong>.
          </p>

          <p>
            Your scholarship application and free class data support eligibility 
            are currently under review by our admissions team.
          </p>

          <p>
            You’re one step closer to joining a practical tech learning experience 
            with live classes, projects, mentorship, and certification.
          </p>

          <p>
            Our admissions team will contact you within 
            <strong>24–48 hours</strong> with the next steps regarding your 
            admission and scholarship status.
          </p>

          <div style="text-align:center;margin:30px 0;">
            <a
              href="${whatsappLink}"
              style="
                background:#25D366;
                color:#ffffff;
                padding:14px 24px;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
                display:inline-block;
              "
            >
              💬 Join Student Community
            </a>
          </div>

          <p>
            Best regards,<br>
            <strong>Admissions Team</strong><br>
            World Class Tech Academy
          </p>

          <hr style="margin:30px 0;border:none;border-top:1px solid #e5e5e5;">

          <p style="font-size:12px;color:#666;text-align:center;">
            © 2026 World Class Tech Academy. All rights reserved.
          </p>

        </div>
      </div>
    `;

    // ================= SEND EMAIL TO STUDENT =================
    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Application Successfully Received",
      html: studentHtml
    });

    // ================= ADMIN EMAIL =================
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

    // ================= SUCCESS RESPONSE =================
    return res.status(200).json({
      success: true,
      message: "Application submitted successfully"
    });

  } catch (error) {

    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Submission failed",
      error: error.message
    });
  }
}