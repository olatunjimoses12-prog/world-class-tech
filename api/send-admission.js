import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

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

    await transporter.sendMail({

      from:
        `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,

      to: "olatunjimoses12@gmail.com",

      subject: "Test Admission Email",

      html: `
        <h1>Admission Approved 🎉</h1>
        <p>This is a test email.</p>
      `
    });

    return res.status(200).json({

      success: true,

      message: "Email sent successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      error: error.message
    });
  }
}