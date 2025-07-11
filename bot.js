require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');

// 📌 تنظیم پراکسی سایفون
const proxyUrl = 'http://127.0.0.1:52516'; // آدرس HTTP Proxy سایفون
const agent = new HttpsProxyAgent(proxyUrl);

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
    console.error('❌ Bot token is missing in .env');
    process.exit(1);
}

const bot = new Telegraf(botToken, {
    telegram: { agent }
});

// 📂 مدیریت فایل کاربران
const usersFilePath = path.join(__dirname, 'telegram_users.json');

function loadUsers() {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    }
    return [];
}

function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// 🎯 شروع تعامل
bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const username = ctx.from.username || 'کاربر ناشناس';

    let users = loadUsers();
    const alreadyRegistered = users.some(u => u.chatId === chatId);

    if (alreadyRegistered) {
        ctx.reply(`✅ سلام ${username}!\nشما قبلاً ثبت‌نام کرده‌اید.`);
    } else {
        users.push({
            chatId: chatId,
            username: username,
            registeredAt: new Date().toISOString()
        });
        saveUsers(users);
        ctx.reply(`🎉 سلام ${username}!\nشما با موفقیت ثبت شدید.`);
    }
});

// 🟢 اجرای ربات
bot.launch()
    .then(() => console.log('🤖 Bot is running with proxy...'))
    .catch(err => console.error('❌ Error starting the bot:', err));
