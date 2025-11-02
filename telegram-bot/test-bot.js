import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log('🧪 Testing bot connection...');

const bot = new Telegraf(BOT_TOKEN);

// Test bot info
bot.telegram.getMe()
  .then((botInfo) => {
    console.log('✅ Bot is connected!');
    console.log(`📱 Bot username: @${botInfo.username}`);
    console.log(`🤖 Bot name: ${botInfo.first_name}`);
    console.log(`🆔 Bot ID: ${botInfo.id}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to connect to bot:', error.message);
    process.exit(1);
  });

