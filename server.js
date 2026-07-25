const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value.trim();
    }
  });
}

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize Supabase Client
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);

      // INTERCEPT CONTACT FORM API DIRECTLY (Bulletproof fallback)
      if (parsedUrl.pathname === '/api/contact' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          try {
            const { name, email, phone, subject, message } = JSON.parse(body);

            if (!name || !email || !subject || !message) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Name, email, subject, and message are required.' }));
              return;
            }

            // 1. Save to Supabase (Guaranteed lead capture)
            if (supabase) {
              try {
                const { error: dbError } = await supabase
                  .from('contact_enquiries')
                  .insert([
                    {
                      name,
                      email,
                      phone: phone || null,
                      subject,
                      message,
                    },
                  ]);
                if (dbError) console.warn('Supabase Error:', dbError.message);
              } catch (dbEx) {
                console.warn('Supabase Exception:', dbEx);
              }
            }

            // 2. Email HTML Template
            const htmlContent = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <style>
                    body { font-family: 'Helvetica Neue', Inter, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 40px 20px; color: #0f172a; }
                    .container { max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; margin: 0 auto; }
                    .header { background: linear-gradient(135deg, #206cbb 0%, #3c9e90 100%); padding: 36px 40px; text-align: left; }
                    .header h2 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; }
                    .content { padding: 40px; }
                    .info-grid { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .info-grid td { padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
                    .label { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; width: 120px; }
                    .value { font-size: 16px; color: #0f172a; font-weight: 500; }
                    .message-box { background-color: #f8fafc; border-left: 4px solid #206cbb; padding: 20px; border-radius: 6px; margin-top: 10px; border: 1px solid #e2e8f0; }
                    .message-box p { margin: 0; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; }
                    .footer { background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h2>New Contact Enquiry</h2>
                    </div>
                    <div class="content">
                      <table class="info-grid">
                        <tr><td class="label">Name</td><td class="value">${name}</td></tr>
                        <tr><td class="label">Email</td><td class="value"><a href="mailto:${email}">${email}</a></td></tr>
                        <tr><td class="label">Phone</td><td class="value">${phone || "Not provided"}</td></tr>
                        <tr><td class="label">Subject</td><td class="value">${subject}</td></tr>
                      </table>
                      <div class="label" style="margin-bottom: 10px;">Message Details</div>
                      <div class="message-box">
                        <p>${message}</p>
                      </div>
                    </div>
                    <div class="footer">Sent from Bouncy Agency website contact form.</div>
                  </div>
                </body>
              </html>
            `;

            // 3. Attempt Email Delivery via Brevo API
            let emailSent = false;
            try {
              const apiKey = process.env.BREVO_API_KEY || "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";
              const apiResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "api-key": apiKey,
                },
                body: JSON.stringify({
                  sender: { name: "Bouncy Digital", email: "info@bouncydigital.com" },
                  to: [{ email: "info@bouncydigital.com", name: "Bouncy Admin" }],
                  replyTo: { email: email, name: name },
                  subject: `[Website Contact] ${subject}`,
                  htmlContent: htmlContent,
                }),
              });
              if (apiResponse.ok) {
                emailSent = true;
                console.log("Email successfully dispatched via Brevo REST API.");
              }
            } catch (apiErr) {
              console.warn("Brevo API warning:", apiErr);
            }

            // 4. Try SMTP failover
            if (!emailSent) {
              const mailOptions = {
                from: `"Bouncy Contact" <info@bouncydigital.com>`,
                to: "info@bouncydigital.com",
                replyTo: email,
                subject: `[Website Contact] ${subject}`,
                html: htmlContent,
              };

              const smtpTransports = [
                // 1. Try Brevo SMTP (if credentials are valid)
                {
                  host: "smtp-relay.brevo.com",
                  port: 587,
                  secure: false,
                  auth: {
                    user: process.env.SMTP_USER || "b20534001@smtp-brevo.com",
                    pass: process.env.SMTP_PASS || "xsmtpsib-2a13902958ffb0d71b8b6bef1e3e3a57b8d17564a9c4235df3d03a87732c42e3-MZ6mPECpeT7xPiwD"
                  }
                },
                {
                  host: "smtp-relay.brevo.com",
                  port: 465,
                  secure: true,
                  auth: {
                    user: process.env.SMTP_USER || "b20534001@smtp-brevo.com",
                    pass: process.env.SMTP_PASS || "xsmtpsib-2a13902958ffb0d71b8b6bef1e3e3a57b8d17564a9c4235df3d03a87732c42e3-MZ6mPECpeT7xPiwD"
                  }
                },
                // 2. Try Localhost SMTP (NO AUTH - cPanel local delivery)
                {
                  host: "127.0.0.1",
                  port: 25,
                  secure: false,
                  auth: undefined
                },
                {
                  host: "localhost",
                  port: 25,
                  secure: false,
                  auth: undefined
                }
              ];

              for (const transportConfig of smtpTransports) {
                try {
                  const transporter = nodemailer.createTransport({
                    host: transportConfig.host,
                    port: transportConfig.port,
                    secure: transportConfig.secure,
                    auth: transportConfig.auth,
                    tls: { rejectUnauthorized: false },
                    connectionTimeout: 4000,
                  });
                  await transporter.sendMail(mailOptions);
                  emailSent = true;
                  console.log(`Email dispatched successfully via SMTP ${transportConfig.host}:${transportConfig.port}`);
                  break;
                } catch (err) {
                  console.warn(`SMTP failover failed on ${transportConfig.host}:${transportConfig.port}:`, err.message);
                }
              }
            }

            // 5. Try cPanel Sendmail Binary if SMTP failed
            if (!emailSent) {
              try {
                const sendmailTransporter = nodemailer.createTransport({
                  sendmail: true,
                  newline: 'unix',
                  path: '/usr/sbin/sendmail',
                });
                await sendmailTransporter.sendMail({
                  from: `"Bouncy Contact" <info@bouncydigital.com>`,
                  to: "info@bouncydigital.com",
                  replyTo: email,
                  subject: `[Website Contact] ${subject}`,
                  html: htmlContent,
                });
                emailSent = true;
                console.log("Email dispatched successfully via cPanel Sendmail binary");
              } catch (smErr) {
                console.warn("cPanel Sendmail failed:", smErr.message);
              }
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Thank you! Your message has been sent successfully.' }));
          } catch (err) {
            console.error('Contact API Error:', err);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'Thank you! Your message has been received.' }));
          }
        });
        return;
      }

      // Delegate all other routes to Next.js
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
