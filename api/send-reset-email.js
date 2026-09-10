import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { toEmail, studentName, regNo, resetToken, resetUrl } = req.body;

    if (!toEmail || !resetUrl) {
      return res.status(400).json({ success: false, message: 'Recipient email and reset URL are required.' });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    let transporter;

    if (gmailUser && gmailPass) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass.replace(/\s+/g, '')
        }
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    const mailOptions = {
      from: `"Christ University Safety Desk" <${gmailUser || 'no-reply.security@btech.christuniversity.in'}>`,
      to: toEmail,
      subject: `🔐 Security Password Reset Link for ${studentName || 'Student'} (${regNo || 'CHRIST'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e1126; color: #ffffff; padding: 24px; border-radius: 16px; border: 2px solid #a855f7;">
          <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #334155;">
            <h2 style="color: #a855f7; margin: 0;">CHRIST UNIVERSITY KENGERI CAMPUS</h2>
            <p style="color: #94a3b8; font-size: 12px; margin: 4px 0 0 0;">Campus Safety & Emergency Response Portal</p>
          </div>
          
          <div style="padding: 20px 0;">
            <p style="font-size: 16px; color: #f8fafc;">Dear <strong>${studentName || 'Student'}</strong> (Reg No: <strong>${regNo}</strong>),</p>
            <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6;">
              You requested to reset your password for the Christ University Kengeri Safety Portal.
              Click the link below to change your password and confirm:
            </p>
            
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl}" target="_blank" style="background: linear-gradient(to right, #9333ea, #4f46e5); color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 12px; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(147, 51, 234, 0.4);">
                🔗 CLICK HERE TO CHANGE PASSWORD & CONFIRM ➔
              </a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; font-family: monospace; word-break: break-all;">
              Direct Link: <a href="${resetUrl}" style="color: #38bdf8;">${resetUrl}</a>
            </p>
          </div>

          <div style="border-top: 1px solid #334155; padding-top: 14px; text-align: center; font-size: 11px; color: #64748b;">
            This email was sent by Christ University Safety Control Desk. If you did not request this, please contact Campus Security Control (+91 8639527123).
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: `Actual reset email dispatched to ${toEmail}!`,
      messageId: info.messageId
    });
  } catch (err) {
    console.error('Vercel email dispatch error:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to dispatch email.'
    });
  }
}
