require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const USERS_FILE = 'telegram_users.json';

const bot = new Telegraf(BOT_TOKEN);

// 📦 خواندن کاربران ثبت‌شده
function loadUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.log('🔔 فایل کاربران پیدا نشد، فایل جدید ساخته می‌شود');
        return [];
    }
}

// 💾 ذخیره کاربران
function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// 🤖 وقتی کاربر start می‌زند
bot.start((ctx) => {
    const users = loadUsers();
    const existingUser = users.find((u) => u.chat_id === ctx.chat.id);

    if (existingUser) {
        ctx.reply('✅ شما قبلاً ثبت‌نام کرده‌اید.');
    } else {
        const newUser = {
            chat_id: ctx.chat.id,
            full_name: `${ctx.from.first_name || ''} ${ctx.from.last_name || ''}`,
            username: ctx.from.username || '',
            phone: '' // شماره‌اش را بعداً از API سمت فرانت ذخیره می‌کنیم
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
