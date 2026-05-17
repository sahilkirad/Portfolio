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
    const { from_name, from_email, subject, message } = req.body || {};

    if (!from_name || !from_email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const payload = {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
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

    if (emailJsRes.status === 200) {
      return res.status(200).json({ success: true });
    }

    return res.status(500).json({ error: 'Failed to send email' });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
}
