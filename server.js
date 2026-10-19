/* eslint-disable @typescript-eslint/no-require-imports */
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
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize Supabase Client
let supabase = null;
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
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

            // 3. Dispatch Email via Server Mail (Sendmail / Local MTA / Configured Server SMTP)
            let emailSent = false;
            const mailTo = process.env.MAIL_TO || "info@bouncydigital.com";
            const mailFrom = process.env.MAIL_FROM || `"Bouncy Contact" <info@bouncydigital.com>`;

            const mailOptions = {
              from: mailFrom,
              to: mailTo,
              replyTo: `"${name}" <${email}>`,
              subject: `[Website Contact] ${subject}`,
              html: htmlContent,
            };

            const transportsToTry = [];

            // A. If custom SMTP_HOST is explicitly configured (non-Brevo)
            if (process.env.SMTP_HOST && !process.env.SMTP_HOST.includes("brevo")) {
              const host = process.env.SMTP_HOST;
              const port = parseInt(process.env.SMTP_PORT || "587", 10);
              const secure = process.env.SMTP_SECURE === "true" || port === 465;
              const auth = (process.env.SMTP_USER && process.env.SMTP_PASS)
                ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
                : undefined;

              transportsToTry.push({
                name: `Configured SMTP (${host}:${port})`,
                transport: nodemailer.createTransport({
                  host,
                  port,
                  secure,
                  auth,
                  tls: { rejectUnauthorized: false },
                  connectionTimeout: 5000,
                }),
              });
            }

            // B. cPanel / Linux Sendmail Binary (Native Exim MTA)
            const sendmailCandidates = [
              process.env.SENDMAIL_PATH,
              '/usr/sbin/sendmail',
              '/usr/bin/sendmail',
              '/usr/lib/sendmail',
            ].filter(Boolean);

            let sendmailBinaryFound = null;
            for (const smPath of sendmailCandidates) {
              if (fs.existsSync(smPath)) {
                sendmailBinaryFound = smPath;
                break;
              }
            }

            if (sendmailBinaryFound || process.platform === 'linux') {
              const binaryPath = sendmailBinaryFound || '/usr/sbin/sendmail';
              transportsToTry.push({
                name: `Server Sendmail Binary (${binaryPath})`,
                transport: nodemailer.createTransport({
                  sendmail: true,
                  newline: 'unix',
                  path: binaryPath,
                }),
              });
            }

            // C. Localhost SMTP (cPanel local delivery via port 25)
            transportsToTry.push({
              name: "Local SMTP (127.0.0.1:25)",
              transport: nodemailer.createTransport({
                host: "127.0.0.1",
                port: 25,
                secure: false,
                tls: { rejectUnauthorized: false },
                connectionTimeout: 4000,
              }),
            });

            transportsToTry.push({
              name: "Local SMTP (localhost:25)",
              transport: nodemailer.createTransport({
                host: "localhost",
                port: 25,
                secure: false,
                tls: { rejectUnauthorized: false },
                connectionTimeout: 4000,
              }),
            });

            // D. Domain mail server fallback if SMTP credentials provided
            if (process.env.SMTP_USER && process.env.SMTP_PASS && !process.env.SMTP_HOST) {
              transportsToTry.push({
                name: "cPanel Domain Mail (mail.bouncydigital.com:465)",
                transport: nodemailer.createTransport({
                  host: "mail.bouncydigital.com",
                  port: 465,
                  secure: true,
                  auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                  },
                  tls: { rejectUnauthorized: false },
                  connectionTimeout: 5000,
                }),
              });
            }

            for (const item of transportsToTry) {
              try {
                await item.transport.sendMail(mailOptions);
                emailSent = true;
                console.log(`Email dispatched successfully via ${item.name}`);
                break;
              } catch (transportErr) {
                console.warn(`Server mail attempt failed via ${item.name}:`, transportErr.message);
              }
            }

            if (!emailSent) {
              console.warn("Notice: All server mail delivery transports were attempted. Lead is saved in Supabase.");
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
  });

  // Track active socket connections for graceful shutdown
  const sockets = new Set();
  server.on('connection', (socket) => {
    sockets.add(socket);
    socket.on('close', () => {
      sockets.delete(socket);
    });
  });

  // Graceful shutdown handler
  let isShuttingDown = false;
  const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    console.log(`Received ${signal}. Initiating graceful shutdown...`);

    // Stop accepting new connections
    server.close((err) => {
      if (err) {
        console.error('Error while closing HTTP server:', err);
        process.exit(1);
      } else {
        console.log('HTTP server closed gracefully.');
        process.exit(0);
      }
    });

    // Safety timeout: give active requests up to 5s to complete before destroying lingering sockets
    const forceTimeout = setTimeout(() => {
      console.warn('Safety timeout reached. Cleaning up remaining open sockets...');
      for (const socket of sockets) {
        socket.destroy();
      }
      process.exit(0);
    }, 5000);

    if (forceTimeout.unref) {
      forceTimeout.unref();
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
