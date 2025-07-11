require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// مسیر فایل کاربران
const dataDir = path.join(__dirname, 'data');
const USERS_FILE = path.join(__dirname, 'data', 'telegram_users.json');

// 🗂️ اگر پوشه data وجود نداشت، ایجادش کن
if (!fs.existsSync(dataDir)) {
    console.log("📁 پوشه data وجود ندارد، ایجاد می‌شود...");
    fs.mkdirSync(dataDir, { recursive: true });
}

const bot = new Telegraf(BOT_TOKEN);

// 📦 خواندن کاربران ثبت‌شده
function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            console.log('📂 فایل کاربران وجود ندارد، ایجاد می‌شود...');
            fs.writeFileSync(USERS_FILE, '[]');
        }
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('❌ خطا در خواندن فایل کاربران:', err);
        return [];
    }
}

// 💾 ذخیره کاربران
function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        console.log('✅ اطلاعات کاربران با موفقیت ذخیره شد.');
    } catch (err) {
        console.error('❌ خطا در ذخیره فایل کاربران:', err);
    }
}

// 🤖 وقتی کاربر start می‌زند
bot.start((ctx) => {
    const users = loadUsers();
    const existingUser = users.find((u) => u.chat_id === ctx.chat.id);

    if (existingUser) {
        ctx.reply('✅ شما قبلاً ثبت‌نام کرده‌اید.');
        console.log(`ℹ️ کاربر ${ctx.chat.id} قبلاً ثبت‌نام کرده است.`);
    } else {
        const newUser = {
            chat_id: ctx.chat.id,
            full_name: `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`,
            username: ctx.from.username || '',
            phone: '' // شماره‌اش بعداً از سمت فرانت اضافه می‌شود
        };
        users.push(newUser);
        saveUsers(users);
        ctx.reply('🎉 خوش آمدید! شما با موفقیت ثبت شدید.');
        console.log(`✅ کاربر جدید ثبت شد: ${ctx.chat.id}`);
    }
});

// 🌐 API دریافت کاربران (برای تست)
app.get('/users', (req, res) => {
    const users = loadUsers();
    res.json(users);
});

// 🚀 راه‌اندازی سرور
app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`);
});

// ⏯️ اجرای ربات
bot.launch();
console.log('🤖 Bot started...');
