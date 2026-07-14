import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validation Check
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required." },
        { status: 400 }
      );
    }

    // Configure Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Premium HTML email styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Helvetica Neue', Inter, Arial, sans-serif;
              background-color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
              color: #0f172a;
            }
            .container {
              max-width: 600px;
              background-color: #ffffff;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
              overflow: hidden;
              margin: 0 auto;
            }
            .header {
              background: linear-gradient(135deg, #206cbb 0%, #3c9e90 100%);
              padding: 36px 40px;
              text-align: left;
            }
            .header h2 {
              margin: 0;
              color: #ffffff;
              font-size: 24px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .content {
              padding: 40px;
            }
            .info-grid {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .info-grid td {
              padding: 14px 0;
              border-bottom: 1px solid #f1f5f9;
            }
            .label {
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #64748b;
              width: 120px;
            }
            .value {
              font-size: 16px;
              color: #0f172a;
              font-weight: 500;
            }
            .message-box {
              background-color: #f8fafc;
              border-left: 4px solid #206cbb;
              padding: 20px;
              border-radius: 6px;
              margin-top: 10px;
              border-top: 1px solid #e2e8f0;
              border-right: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
            }
            .message-box p {
              margin: 0;
              font-size: 15px;
              line-height: 1.6;
              color: #334155;
              white-space: pre-wrap;
            }
            .footer {
              background-color: #f8fafc;
              border-top: 1px solid #e2e8f0;
              padding: 24px 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Enquiry</h2>
            </div>
            <div class="content">
              <table class="info-grid">
                <tr>
                  <td class="label">Name</td>
                  <td class="value">${name}</td>
                </tr>
                <tr>
                  <td class="label">Email</td>
                  <td class="value"><a href="mailto:${email}" style="color: #206cbb; text-decoration: none;">${email}</a></td>
                </tr>
                <tr>
                  <td class="label">Phone</td>
                  <td class="value">${phone || "Not provided"}</td>
                </tr>
                <tr>
                  <td class="label">Subject</td>
                  <td class="value" style="font-weight: 700;">${subject}</td>
                </tr>
              </table>

              <div class="label" style="margin-bottom: 10px;">Message Details</div>
              <div class="message-box">
                <p>${message}</p>
              </div>
            </div>
            <div class="footer">
              This message was sent from your Bouncy Agency website contact form.
            </div>
          </div>
        </body>
      </html>
    `;

    // Mail configurations
    const mailOptions = {
      from: `"${name} via Bouncy Contact" <info@bouncydigital.com>`,
      to: "info@bouncydigital.com",
      replyTo: email,
      subject: `[Website Contact] ${subject}`,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Enquiry sent successfully!" });
  } catch (error: any) {
    console.error("Nodemailer Send Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to deliver contact email." },
      { status: 500 }
    );
  }
}
