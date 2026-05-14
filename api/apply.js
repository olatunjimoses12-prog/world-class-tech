import nodemailer from "nodemailer";

export default async function handler(req, res) {

  // =========================
  // ❌ ONLY ALLOW POST
  // =========================
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed"
    });
  }

  const { name, email, phone, course } = req.body;

  // =========================
  // ✅ ZOHO SMTP
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

  try {

    // =========================
    // ✅ SAVE TO GOOGLE SHEETS
    // =========================
    console.log("Saving to Google Sheets...");

    const sheetResponse = await fetch(
      process.env.GOOGLE_SCRIPT_URL,
      {
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
      }
    );

    const rawText = await sheetResponse.text();

    console.log("Google Script Response:", rawText);

    let sheetData;

    try {
      sheetData = JSON.parse(rawText);
    } catch (err) {

      console.error("Google Script JSON Parse Error:", err);

      return res.status(500).json({
        success: false,
        message: "Invalid response from Google Script"
      });
    }

    // =========================
    // ❌ DUPLICATE USER
    // =========================
    if (!sheetData.success) {

      console.log("Duplicate detected");

      return res.status(400).json({
        success: false,
        message:
          sheetData.message ||
          "Duplicate application detected"
      });
    }

    // =========================
    // ✅ EMAIL TEMPLATE
    // =========================
    const logoUrl =
      "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

    const whatsappLink =
      "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    const studentHtml = `
      <div style="
        font-family:Arial,sans-serif;
        background:#f4f6f8;
        padding:20px;
      ">

        <div style="
          max-width:600px;
          margin:auto;
          background:#ffffff;
          border-radius:12px;
          padding:35px;
        ">

          <div style="text-align:center;">
            <img 
              src="${logoUrl}"
              style="
                max-width:170px;
                margin-bottom:20px;
              "
            />
          </div>

          <h2 style="
            color:#0a2540;
            margin-bottom:20px;
          ">
            Application Successfully Received 🎉
          </h2>

          <p>
            Dear <strong>${name}</strong>,
          </p>

          <p>
            Thank you for applying to
            <strong>World Class Tech Academy</strong>.
          </p>

          <p>
            We have successfully received your application for
            <strong>${course}</strong>.
          </p>

          <p>
            Your scholarship application and free class
            data support eligibility are currently under review
            by our admissions team.
          </p>

          <p>
            You’re one step closer to joining a practical
            tech learning experience with live classes,
            projects, mentorship, and certification.
          </p>

          <p>
            Our admissions team will contact you within
            <strong>24–48 hours</strong>
            with the next steps regarding your admission
            and scholarship status.
          </p>

          <div style="
            text-align:center;
            margin:30px 0;
          ">

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

          <hr style="
            margin:30px 0;
            border:none;
            border-top:1px solid #e5e5e5;
          ">

          <p style="
            font-size:12px;
            color:#666;
            text-align:center;
          ">
            © 2026 World Class Tech Academy.
            All rights reserved.
          </p>

        </div>
      </div>
    `;

    // =========================
    // ✅ SEND STUDENT EMAIL
    // =========================
    console.log("Sending student email...");

    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject:
        "✅ Application Received | World Class Tech Academy",
      html: studentHtml
    });

    console.log("Student email sent successfully");

    // =========================
    // ✅ SEND ADMIN EMAIL
    // =========================
    console.log("Sending admin email...");

    await transporter.sendMail({
      from: `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚀 New Application Received",
      html: `
        <div style="font-family:Arial,sans-serif;">

          <h2>
            New Student Application
          </h2>

          <p>
            <b>Name:</b> ${name}
          </p>

          <p>
            <b>Email:</b> ${email}
          </p>

          <p>
            <b>Phone:</b> ${phone}
          </p>

          <p>
            <b>Course:</b> ${course}
          </p>

        </div>
      `
    });

    console.log("Admin email sent successfully");

    // =========================
    // ✅ SUCCESS RESPONSE
    // =========================
    return res.status(200).json({
      success: true,
      message: "Application submitted successfully"
    });

  } catch (error) {

    // =========================
    // ❌ FULL ERROR LOG
    // =========================
    console.error("FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Submission failed",
      error: error.message
    });
  }
}