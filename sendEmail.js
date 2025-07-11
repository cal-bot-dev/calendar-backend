require('dotenv').config();
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// 🔑 ایجاد ترنسپورتر با Gmail SMTP
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // از SSL استفاده کن
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📝 خواندن قالب HTML ایمیل
const emailTemplatePath = path.join(__dirname, 'templates', 'emailTemplate.html');
let emailTemplate = '';
try {
    emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
} catch (err) {
    console.error('❌ خطا در بارگذاری قالب ایمیل:', err);
}

// 📬 API ارسال ایمیل
app.post('/send-email', async (req, res) => {
    const { to, fullName, eventTitle, daysLeft } = req.body;

    console.log('📥 درخواست ایمیل دریافت شد:', req.body);

    // 📄 لود قالب ایمیل
    const fs = require('fs');
    const path = require('path');
    const templatePath = path.join(__dirname, 'emailTemplate.html');
    let emailTemplate = fs.readFileSync(templatePath, 'utf8');

    // 📝 جایگزینی مقادیر
    emailTemplate = emailTemplate
        .replace('{{fullName}}', fullName || 'کاربر عزیز')
        .replace('{{eventTitle}}', eventTitle || 'مناسبت شما')
        .replace('{{daysLeft}}', daysLeft || 'چند');

    try {
        await transporter.sendMail({
            from: `"Calendar Reminder" <${process.env.EMAIL_USER}>`,
            to,
            subject: '🎉 یادآوری مناسبت شما',
            html: emailTemplate
        });

        console.log(`✅ ایمیل HTML با موفقیت به ${to} ارسال شد.`);
        res.status(200).send('Email sent successfully.');
    } catch (error) {
        console.error('❌ خطا در ارسال ایمیل:', error);
        res.status(500).send('Failed to send email.');
    }
});


// 🚀 اجرای سرور
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
