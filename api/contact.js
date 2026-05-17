export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { from_name, from_email, subject, message } = body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!from_name || !from_email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!emailRegex.test(String(from_email).trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (
      !process.env.EMAILJS_SERVICE_ID ||
      !process.env.EMAILJS_TEMPLATE_ID ||
      !process.env.EMAILJS_PUBLIC_KEY ||
      !process.env.EMAILJS_PRIVATE_KEY
    ) {
      return res.status(500).json({ error: 'Missing EmailJS environment variables' });
    }
    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        from_name,
        from_email,
        subject,
        message,
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
    };

    const emailJsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (emailJsRes.ok) {
      return res.status(200).json({ success: true });
    }

    const emailJsErrorText = await emailJsRes.text();
    console.error('EmailJS send failed', {
      status: emailJsRes.status,
      response: emailJsErrorText
    });
    return res.status(500).json({
      error: 'Failed to send email',
      details: emailJsErrorText
    });
  } catch (error) {
    console.error('Contact API server error', error);
    return res.status(500).json({
      error: 'Server error',
      details: error?.message || 'Unknown error'
    });
  }
}
