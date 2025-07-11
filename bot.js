require('dotenv').config();
const { Telegraf } = require('telegraf');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// راه‌اندازی ربات تلگرام
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
    ctx.reply('سلام 👋 خوش آمدید! شما با موفقیت ثبت شدید.');
    // اینجا می‌تونی chat_id رو ذخیره کنی
});

bot.launch()
    .then(() => console.log('✅ Telegram bot is running'))
    .catch((err) => console.error('❌ Error starting the bot:', err));

// راه‌اندازی یک API ساده برای Render
app.get('/', (req, res) => {
    res.send('🎉 Telegram bot is running!');
});

app.listen(PORT, () => {
    console.log(`🌐 Server is listening on port ${PORT}`);
});

// جلوگیری از خاموش شدن بات
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
