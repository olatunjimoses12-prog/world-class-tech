import nodemailer from "nodemailer";

export default async function handler(req, res) {

  try {

    // =========================
    // ✅ ALLOW ONLY POST
    // =========================
    if (req.method !== "POST") {

      return res.status(405).json({
        success: false,
        message: "Method Not Allowed"
      });
    }

    // =========================
    // ✅ GET DATA
    // =========================
    const {
      name,
      email,
      course
    } = req.body || {};

    console.log(
      "BODY:",
      req.body
    );

    // =========================
    // ✅ VALIDATE
    // =========================
    if (!email) {

      return res.status(400).json({

        success: false,

        message:
          "Email is required"
      });
    }

    // =========================
    // ✅ SMTP
    // =========================
    const transporter =
      nodemailer.createTransport({

        host: "smtp.zoho.com",

        port: 465,

        secure: true,

        auth: {

          user:
            process.env.EMAIL_USER,

          pass:
            process.env.EMAIL_PASS
        }
      });

    // =========================
    // ✅ EMAIL TEMPLATE
    // =========================
    const htmlBody = `

      <div style="
        font-family:Arial;
        padding:20px;
      ">

        <h1>
          Congratulations 🎉
        </h1>

        <p>
          Dear ${name},
        </p>

        <p>
          Your admission for
          <strong>${course}</strong>
          has been approved.
        </p>

        <p>
          Welcome to
          World Class Tech Academy.
        </p>

      </div>
    `;

    // =========================
    // ✅ SEND MAIL
    // =========================
    await transporter.sendMail({

      from:
        `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,

      to: email,

      subject:
        "🎉 Admission Approved",

      html: htmlBody
    });

    // =========================
    // ✅ SUCCESS
    // =========================
    return res.status(200).json({

      success: true,

      message:
        "Admission email sent"
    });

  } catch (error) {

    console.log(
      "FULL ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        error.message
    });
  }
}