const nodemailer = require('nodemailer');

async function main() {
  console.log("Testing SMTP connection with Brevo...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log("Verifying credentials...");
    await transporter.verify();
    console.log("✅ SMTP Connection Successful! Credentials are correct.");
    
    console.log("Sending a test email to hass.javed25@gmail.com...");
    const info = await transporter.sendMail({
      from: `"SMTP Test" <info@bouncydigital.com>`,
      to: "hass.javed25@gmail.com",
      subject: "Bouncy Agency - SMTP Test",
      text: "Hello! This is a test email verifying that your Brevo SMTP relay is working correctly.",
      html: "<h3>Hello!</h3><p>This is a test email verifying that your Brevo SMTP relay is working correctly.</p>"
    });
    console.log("✅ Email sent successfully! MessageId:", info.messageId);
  } catch (error) {
    console.error("❌ SMTP Verification/Send Failed:", error);
  }
}

main();
