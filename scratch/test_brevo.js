async function testBrevo() {
  const apiKey = "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";
  
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Bouncy Digital", email: "info@bouncydigital.com" },
      to: [{ email: "info@bouncydigital.com", name: "Bouncy Admin" }],
      replyTo: { email: "hass.javed25@gmail.com", name: "Hassan Javed" },
      subject: "[Website Test Contact] Test Email",
      htmlContent: "<h3>Test Contact Form Email</h3><p>This is a test message from Bouncy website.</p>",
    }),
  });

  console.log("Status:", res.status);
  const text = await res.text();
  console.log("Response:", text);
}

testBrevo();
