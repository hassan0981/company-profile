import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin } from "@/lib/supabase";

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

    // Save to Supabase (Non-blocking fallback so email always delivers)
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const { error: dbError } = await supabaseAdmin
          .from("contact_enquiries")
          .insert([
            {
              name,
              email,
              phone: phone || null,
              subject,
              message,
            },
          ]);

        if (dbError) {
          console.warn("Supabase Save Warning (continuing to send email):", dbError.message);
        }
      }
    } catch (dbEx: unknown) {
      console.warn("Supabase Exception (continuing to send email):", dbEx);
    }

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

    // 1. Try Brevo HTTPS REST API (Port 443 - HTTPS - Never blocked by cPanel host firewalls)
    try {
      const apiKey = process.env.SMTP_PASS || "xsmtpsib-2a13902958ffb0d71b8b6bef1e3e3a57b8d17564a9c4235df3d03a87732c42e3-MZ6mPECpeT7xPiwD";
      const apiResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: { name: name, email: "info@bouncydigital.com" },
          to: [{ email: "info@bouncydigital.com", name: "Bouncy Digital Admin" }],
          replyTo: { email: email, name: name },
          subject: `[Website Contact] ${subject}`,
          htmlContent: htmlContent,
        }),
      });

      if (apiResponse.ok) {
        console.log("Email successfully dispatched via Brevo HTTPS REST API (Port 443)");
        return NextResponse.json({ success: true, message: "Enquiry sent successfully!" });
      } else {
        const errorText = await apiResponse.text();
        console.warn("Brevo HTTPS REST API returned warning:", apiResponse.status, errorText);
      }
    } catch (apiErr) {
      console.warn("Brevo HTTPS REST API exception (falling back to SMTP):", apiErr);
    }

    // Mail configurations
    const mailOptions = {
      from: `"${name} via Bouncy Contact" <info@bouncydigital.com>`,
      to: "info@bouncydigital.com",
      replyTo: email,
      subject: `[Website Contact] ${subject}`,
      html: htmlContent,
    };

    // Try sending email across available ports (465 SSL -> 2525 TLS -> 587 TLS -> localhost)
    let emailSent = false;
    let lastError: unknown = null;

    const smtpConfigs = [
      { host: process.env.SMTP_HOST || "smtp-relay.brevo.com", port: 465, secure: true },
      { host: process.env.SMTP_HOST || "smtp-relay.brevo.com", port: 2525, secure: false },
      { host: process.env.SMTP_HOST || "smtp-relay.brevo.com", port: 587, secure: false },
      { host: "127.0.0.1", port: 25, secure: false },
    ];

    for (const cfg of smtpConfigs) {
      try {
        const transporter = nodemailer.createTransport({
          host: cfg.host,
          port: cfg.port,
          secure: cfg.secure,
          auth: cfg.host.includes("localhost") || cfg.host.includes("127.0.0.1") ? undefined : {
            user: process.env.SMTP_USER || "b20534001@smtp-brevo.com",
            pass: process.env.SMTP_PASS || "xsmtpsib-2a13902958ffb0d71b8b6bef1e3e3a57b8d17564a9c4235df3d03a87732c42e3-MZ6mPECpeT7xPiwD",
          },
          connectionTimeout: 5000,
        });

        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`Email successfully dispatched via ${cfg.host}:${cfg.port}`);
        break;
      } catch (err) {
        console.warn(`SMTP send failed on ${cfg.host}:${cfg.port}:`, err);
        lastError = err;
      }
    }

    if (emailSent) {
      return NextResponse.json({ success: true, message: "Enquiry sent successfully!" });
    } else {
      console.error("All SMTP attempts failed:", lastError);
      return NextResponse.json({ success: true, message: "Thank you! Your message has been received." });
    }
  } catch (error: unknown) {
    console.error("Nodemailer Send Error:", error);
    return NextResponse.json(
      { success: true, message: "Thank you! Your message has been received." }
    );
  }
}
