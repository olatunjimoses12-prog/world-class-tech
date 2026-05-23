import nodemailer from "nodemailer";

export default async function handler(req, res) {

  try {

    // =========================
    // ✅ ZOHO SMTP
    // =========================
    const transporter =
      nodemailer.createTransport({

        host: "smtp.zoho.com",

        port: 465,

        secure: true,

        auth: {

          user: process.env.EMAIL_USER,

          pass: process.env.EMAIL_PASS
        }
      });

    // =========================
    // ✅ SEND TEST EMAIL
    // =========================
    await transporter.sendMail({

      from:
        `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,

      to: "olatunjimoses12@gmail.com",

      subject:
        "🎉 Admission Approved Test",

      html: `

        <div style="
          font-family:Arial;
          padding:20px;
        ">

          <h1>
            Admission Approved 🎉
          </h1>

          <p>
            This is a successful
            test email from
            admin@worldclasstechhub.com
          </p>

        </div>

      `
    });

    // =========================
    // ✅ SUCCESS RESPONSE
    // =========================
    return res.status(200).json({

      success: true,

      message:
        "Email sent successfully"
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      error
    );

    // =========================
    // ❌ ERROR RESPONSE
    // =========================
    return res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
}