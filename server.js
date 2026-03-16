/**
 * Student Warden Alert System - Backend Server
 * Run: node server.js
 */

require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─────────────────────────────────────────────
// EMAIL TRANSPORTER
// ─────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.WARDEN_EMAIL,
    pass: process.env.WARDEN_PASSWORD,
  },
});

// ─────────────────────────────────────────────
// EMAIL TEMPLATES
// ─────────────────────────────────────────────

function studentRegistrationTemplate(student) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center;">
      <h1 style="color: #e2b96f; margin: 0; font-size: 24px;">🏫 College Hostel Management</h1>
      <p style="color: #ccc; margin: 5px 0 0;">Student Registration Confirmed</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1a1a2e;">Welcome, ${student.name}!</h2>
      <p style="color: #555;">Your hostel registration has been successfully completed. Here are your details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #333;">Student ID</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #555;">${student.studentId}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #333;">Name</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #555;">${student.name}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #333;">Email</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #555;">${student.email}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #333;">Phone</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #555;">${student.phone}</td>
        </tr>
      </table>
      <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 20px;">
        <strong>📱 Your QR Code</strong>
        <p style="margin: 5px 0 0; color: #555;">Your unique QR code for hostel entry/exit has been generated. Use it at the hostel gate scanner for check-in and check-out.</p>
      </div>
      <p style="color: #777; font-size: 14px; margin-top: 30px;">If you have any questions, please contact the hostel warden.</p>
    </div>
    <div style="background: #1a1a2e; padding: 20px; text-align: center;">
      <p style="color: #888; margin: 0; font-size: 12px;">College Hostel Management System | Auto-generated email</p>
    </div>
  </div>
</body>
</html>`;
}

function parentNotificationTemplate(student) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center;">
      <h1 style="color: #e2b96f; margin: 0; font-size: 24px;">🏫 College Hostel Management</h1>
      <p style="color: #ccc; margin: 5px 0 0;">Parent Notification</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #1a1a2e;">Dear ${student.parentName},</h2>
      <p style="color: #555;">Your ward <strong>${student.name}</strong> has been successfully registered in the college hostel. We will keep you informed about their hostel activity.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Student Name</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${student.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Student ID</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${student.studentId}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Student Email</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${student.email}</td>
        </tr>
      </table>
      <div style="background: #d4edda; border: 1px solid #28a745; border-radius: 8px; padding: 15px;">
        <strong>✅ Registration Successful</strong>
        <p style="margin: 5px 0 0; color: #155724;">You will receive automatic notifications if your ward enters the hostel after the allowed closing time.</p>
      </div>
    </div>
    <div style="background: #1a1a2e; padding: 20px; text-align: center;">
      <p style="color: #888; margin: 0; font-size: 12px;">College Hostel Management System | Auto-generated email</p>
    </div>
  </div>
</body>
</html>`;
}

function lateEntryTemplate(student, entryTime, closingTime) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #c0392b, #8e1a10); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Late Hostel Entry Notification</h1>
      <p style="color: #ffcccc; margin: 5px 0 0;">College Hostel Management System</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #c0392b;">Dear ${student.parentName},</h2>
      <p style="color: #555;">This is to inform you that your ward entered the hostel <strong>after the allowed closing time</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Student Name</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${student.name}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Student ID</td>
          <td style="padding: 12px; border: 1px solid #ddd;">${student.studentId}</td>
        </tr>
        <tr style="background: #ffeeba;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #856404;">Entry Time</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #856404;"><strong>${entryTime}</strong></td>
        </tr>
        <tr style="background: #f8d7da;">
          <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #721c24;">Allowed Closing Time</td>
          <td style="padding: 12px; border: 1px solid #ddd; color: #721c24;"><strong>${closingTime}</strong></td>
        </tr>
      </table>
      <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 15px;">
        <strong>📞 Action Required</strong>
        <p style="margin: 5px 0 0; color: #721c24;">Please contact the hostel warden if you need more information or have any concerns about this incident.</p>
      </div>
      <p style="color: #777; font-size: 14px; margin-top: 30px;">Regards,<br><strong>Hostel Warden</strong><br>College Hostel Management System</p>
    </div>
    <div style="background: #c0392b; padding: 20px; text-align: center;">
      <p style="color: #ffcccc; margin: 0; font-size: 12px;">College Hostel Management System | Auto-generated alert</p>
    </div>
  </div>
</body>
</html>`;
}

function reminderTemplate(student, minutesLeft, closingTime) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #e67e22, #ca6f1e); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Hostel Closing Reminder</h1>
    </div>
    <div style="padding: 30px;">
      <h2 style="color: #e67e22;">Dear ${student.name},</h2>
      <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="font-size: 20px; font-weight: bold; color: #856404; margin: 0;">
          🚨 Hostel gate will close in <span style="color: #c0392b;">${minutesLeft} minutes</span>!
        </p>
        <p style="color: #856404; margin: 10px 0 0;">Closing Time: <strong>${closingTime}</strong></p>
      </div>
      <p style="color: #555;">Please return to the hostel immediately to avoid being marked as late.</p>
      <p style="color: #777; font-size: 14px; margin-top: 30px;">Regards,<br><strong>Hostel Warden</strong></p>
    </div>
    <div style="background: #e67e22; padding: 20px; text-align: center;">
      <p style="color: white; margin: 0; font-size: 12px;">College Hostel Management System | Automated Reminder</p>
    </div>
  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// API ROUTES
// ─────────────────────────────────────────────

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Student Warden Alert System is running',
    timestamp: new Date().toISOString(),
    emailConfigured: !!(process.env.WARDEN_EMAIL && process.env.WARDEN_PASSWORD)
  });
});

// Send email endpoint
app.post('/send-email', async (req, res) => {
  const { type, student, entryTime, closingTime, minutesLeft } = req.body;

  if (!process.env.WARDEN_EMAIL || !process.env.WARDEN_PASSWORD) {
    return res.status(500).json({ 
      success: false, 
      message: 'Email not configured. Please set WARDEN_EMAIL and WARDEN_PASSWORD in .env file.' 
    });
  }

  try {
    let mailOptions = [];

    switch (type) {
      case 'registration':
        // Email to student
        mailOptions.push({
          from: `"College Hostel Management" <${process.env.WARDEN_EMAIL}>`,
          to: student.email,
          subject: '✅ Hostel Registration Confirmed - Welcome!',
          html: studentRegistrationTemplate(student),
        });
        // Email to parent
        mailOptions.push({
          from: `"College Hostel Management" <${process.env.WARDEN_EMAIL}>`,
          to: student.parentEmail,
          subject: `📋 Your Ward ${student.name} Has Been Registered in Hostel`,
          html: parentNotificationTemplate(student),
        });
        break;

      case 'late-entry':
        mailOptions.push({
          from: `"College Hostel Management" <${process.env.WARDEN_EMAIL}>`,
          to: student.parentEmail,
          subject: `⚠️ Late Hostel Entry Notification - ${student.name}`,
          html: lateEntryTemplate(student, entryTime, closingTime),
        });
        break;

      case 'reminder':
        mailOptions.push({
          from: `"College Hostel Management" <${process.env.WARDEN_EMAIL}>`,
          to: student.email,
          subject: `⏰ Reminder: Hostel Gate Closing in ${minutesLeft} Minutes`,
          html: reminderTemplate(student, minutesLeft, closingTime),
        });
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid email type' });
    }

    // Send all emails
    const results = await Promise.all(
      mailOptions.map(opts => transporter.sendMail(opts))
    );

    console.log(`[${new Date().toISOString()}] Emails sent (type: ${type}):`, results.map(r => r.messageId));
    res.json({ success: true, message: `${mailOptions.length} email(s) sent successfully`, count: mailOptions.length });

  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║    Student Warden Alert System - Server Started   ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  🌐 URL:   http://localhost:${PORT}                  ║`);
  console.log(`║  📧 Email: ${process.env.WARDEN_EMAIL ? '✅ Configured' : '❌ Not configured (set .env)'}              ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});
