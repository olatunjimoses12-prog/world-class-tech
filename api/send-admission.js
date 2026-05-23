import nodemailer from "nodemailer";

export default async function handler(req, res) {

  // =========================
  // ✅ ONLY ALLOW POST
  // =========================
  if (req.method !== "POST") {

    return res.status(405).json({
      message: "Method Not Allowed"
    });
  }

  try {

    const { name, email, course } =
      req.body;

    // =========================
    // ✅ SMTP TRANSPORTER
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
    // ✅ LOGO + COMMUNITY
    // =========================
    const logoUrl =
      "https://drive.google.com/uc?export=view&id=1rBHDAJ1Lfu84__ycwjv58Lu6DIn8eAoK";

    const whatsappLink =
      "https://chat.whatsapp.com/HSpmuCRldp1FooyDYatmBF";

    // =========================
    // 🎉 EMAIL TEMPLATE
    // =========================
    const htmlBody = `

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
          padding:30px;
        ">

          <div style="text-align:center;">

            <img
              src="${logoUrl}"
              style="
                max-width:180px;
                margin-bottom:20px;
              "
            />

          </div>

          <h2 style="color:#0a2540;">

            🎉 Congratulations!
            Your Admission Has Been Approved

          </h2>

          <p>
            Dear <strong>${name}</strong>,
          </p>

          <p>
            Your application for
            <strong>${course}</strong>
            has been approved.
          </p>

          <p>
            Welcome to
            <strong>
              World Class Tech Academy
            </strong>.
          </p>

          <ul style="
            line-height:1.8;
            color:#333;
          ">
            <li>Live online classes</li>
            <li>Practical projects</li>
            <li>Mentorship support</li>
            <li>Certification</li>
            <li>Data support</li>
          </ul>

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

            <strong>
              Admissions Team
            </strong><br>

            World Class Tech Academy
          </p>

        </div>

      </div>
    `;

    // =========================
    // ✅ SEND EMAIL
    // =========================
    await transporter.sendMail({

      from:
        `"World Class Tech Academy" <${process.env.EMAIL_USER}>`,

      to: email,

      subject:
        "🎉 Congratulations! Admission Approved",

      html: htmlBody
    });

    return res.status(200).json({

      success: true,

      message:
        "Admission email sent successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      error:
        error.message
    });
  }
}