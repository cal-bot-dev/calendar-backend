// فایل sendtelegram.js
const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

const USERS_FILE = "users.json";

// تابع برای ذخیره اطلاعات کاربر
function saveUserPhoneNumber(userId, number) {
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const userIndex = users.findIndex(user => user.userId === userId);
    
    if (userIndex !== -1) {
        const user = users[userIndex];
        if (!user.telegramNumbers) user.telegramNumbers = [];

        if (user.telegramNumbers.length < 3) {
            user.telegramNumbers.push(number);
            fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        }
    }
}

app.post("/save-user-telegram", (req, res) => {
    const { userId, number } = req.body;
    saveUserPhoneNumber(userId, number);
    res.send("User phone number saved successfully.");
});

// Start the server
app.listen(3002, () => {
    console.log(" ✅ Server is running on port 3002");
});

