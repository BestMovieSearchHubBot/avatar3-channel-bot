/**
 * Avatar 3 Telegram Channel Auto-Post Bot
 * 
 * This bot automatically posts content about the movie "Avatar: Fire and Ash"
 * to a specified Telegram channel at scheduled times.
 * Each post includes a link to the main movie search bot (@BestMovieSearchHubBot).
 * 
 * Features:
 * - Scheduled posts at IST: 7:45 AM, 10:25 AM, 1:45 PM, 4:00 PM, 6:45 PM
 * - Random selection from a rich library of posts (cast, box office, reviews, etc.)
 * - Inline button that directly opens the main movie bot
 * - SEO-friendly hashtags in each post
 * - Graceful shutdown handling
 * 
 * Deploy on Render with Node.js environment.
 */

// ==================== DEPENDENCIES ====================
const { Telegraf } = require('telegraf');        // Telegram bot framework
const express = require('express');                // Web server for Render health checks
const cron = require('node-cron');                 // Scheduler for daily posts
require('dotenv').config();                         // For local .env file (optional)

// ==================== CONFIGURATION ====================
// Load from environment variables (set these on Render)
const BOT_TOKEN = process.env.BOT_TOKEN;                               // Bot token from BotFather
const CHANNEL_USERNAME = process.env.CHANNEL_USERNAME || '@Avatar3_MovieHD'; // Your channel (change if needed)
const MAIN_BOT_USERNAME = process.env.MAIN_BOT_USERNAME || '@BestMovieSearchHubBot'; // Your main movie bot

// Exit if token is missing
if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is missing! Set it in environment variables.');
  process.exit(1);
}

// ==================== EXPRESS SERVER FOR RENDER ====================
// Render requires a web server to keep the service alive
const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoints
app.get('/', (req, res) => res.send('✅ Avatar 3 Channel Bot is running!'));
app.get('/health', (req, res) => res.status(200).send('OK'));

// Start the express server
app.listen(PORT, () => {
  console.log(`🚀 Express server listening on port ${PORT}`);
});

// ==================== TELEGRAM BOT INIT ====================
const bot = new Telegraf(BOT_TOKEN);

// ==================== POST CONTENT LIBRARY ====================
/**
 * Array of post objects.
 * Each object can have:
 * - type: 'text' (more types like 'photo' can be added later)
 * - content: the message text (Markdown supported, includes hashtags)
 * 
 * These posts are designed to be engaging and SEO-friendly.
 */
const POSTS = [
  // 1. Movie Introduction
  {
    type: 'text',
    content: `🔥 **Avatar: Fire and Ash – The Epic Returns** 🔥

🎬 **Director:** James Cameron
🌍 **Languages:** English, Hindi Dubbed, Tamil, Telugu, Kannada, Malayalam
📅 **Release:** December 2025

❌ **Not available on any OTT platform in India yet!**

👇 **Full Movie Download:**
👉 ${MAIN_BOT_USERNAME}

#Avatar3 #AvatarFireAndAsh #JamesCameron #SciFi #HollywoodMovie #NotOnOTT`
  },

  // 2. Star Cast
  {
    type: 'text',
    content: `🌟 **Star Cast** 🌟

⭐ Sam Worthington (Jake Sully)
⭐ Zoe Saldana (Neytiri)
⭐ Sigourney Weaver (Kiri)
⭐ Stephen Lang (Colonel Quaritch)
⭐ Kate Winslet (Ronal)

🔥 The Na'vi return with a vengeance!
📥 Download: ${MAIN_BOT_USERNAME}

#Avatar3 #Cast #SamWorthington #ZoeSaldana #KateWinslet`
  },

  // 3. Visual Spectacle
  {
    type: 'text',
    content: `🎨 **Visual Spectacle** 🎨

James Cameron pushes boundaries again with:
✅ Underwater mocap technology
✅ 4K HDR visuals
✅ Dolby Atmos sound

Experience Pandora like never before:
👇 ${MAIN_BOT_USERNAME}

#Avatar3 #VisualEffects #4K #DolbyAtmos #JamesCameron`
  },

  // 4. Box Office Prediction
  {
    type: 'text',
    content: `💰 **Box Office Prediction** 💰

Analysts predict:
🌎 Worldwide Opening: **$500 million+**
🇮🇳 India Opening: **₹150 crore+**

Be part of the biggest movie event of the decade!
📥 ${MAIN_BOT_USERNAME}

#Avatar3 #BoxOffice #RecordBreaker #Blockbuster`
  },

  // 5. Storyline Tease
  {
    type: 'text',
    content: `📖 **Storyline Tease** 📖

The Sully family faces new threats from the sky people and the fire Na'vi clan. Jake must unite Pandora once again.

👇 Watch the full epic:
👉 ${MAIN_BOT_USERNAME}

#Avatar3 #Story #Pandora #NaVi #Action`
  },

  // 6. Why It's Not on OTT
  {
    type: 'text',
    content: `❓ **Why Avatar 3 is NOT on OTT?** ❓

Disney+ Hotstar has not released it in India due to licensing disputes. The only way to watch is through our bot!

📥 Download now before links expire:
👉 ${MAIN_BOT_USERNAME}

#Avatar3 #OTT #NotOnHotstar #NotOnNetflix #Exclusive`
  },

  // 7. Fan Craze in India
  {
    type: 'text',
    content: `🇮🇳 **India's Most Awaited Hollywood Movie** 🇮🇳

Avatar 3 is trending #1 on Telegram searches! Thousands of Indians are searching for HD prints daily.

👇 Get it now:
👉 ${MAIN_BOT_USERNAME}

#Avatar3 #India #Trending #MostSearched`
  },

  // 8. Audience Reviews (Early Reactions)
  {
    type: 'text',
    content: `⭐ **Early Audience Reactions** ⭐

*"Better than the first two!"*
*"Visual effects are mind-blowing."*
*"The fire Na'vi are terrifying."*

Add your review after watching:
📥 ${MAIN_BOT_USERNAME}

#Avatar3 #Reviews #AudienceResponse #MustWatch`
  },

  // 9. Comparison with Previous Avatar Films
  {
    type: 'text',
    content: `📊 **Avatar Franchise – How 3 Compares** 📊

🎥 Avatar (2009) – $2.9B worldwide
🎥 Avatar 2 (2022) – $2.3B worldwide
🎥 Avatar 3 – Expected to cross $3B!

Be part of history:
👇 ${MAIN_BOT_USERNAME}

#Avatar3 #AvatarFranchise #BoxOffice #JamesCameron`
  },

  // 10. Download Links Post
  {
    type: 'text',
    content: `📥 **Download Avatar 3 Full Movie** 📥

✅ 4K / 1080p / 720p
✅ English + Hindi Dubbed + Tamil + Telugu
✅ Fast download (Terabox/Doodstream)

👇 Download now:
👉 ${MAIN_BOT_USERNAME}

#Avatar3 #Download #4K #HindiDubbed #HollywoodMovie`
  }
];

// ==================== FUNCTION TO SEND RANDOM POST WITH BUTTON ====================
/**
 * Picks a random post from the library and sends it to the channel with an inline button.
 * The button opens the main movie bot.
 */
async function sendRandomPost() {
  try {
    // Pick a random post from the library
    const randomIndex = Math.floor(Math.random() * POSTS.length);
    const post = POSTS[randomIndex];
    
    console.log(`📤 Sending post #${randomIndex + 1} at ${new Date().toLocaleString()}`);
    
    // Only text posts are supported for now (can be extended)
    if (post.type === 'text') {
      await bot.telegram.sendMessage(CHANNEL_USERNAME, post.content, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            // Button that redirects to the main movie bot
            [{ text: '📥 Download Now', url: `https://t.me/${MAIN_BOT_USERNAME.replace('@', '')}` }]
          ]
        }
      });
      console.log('✅ Post sent successfully with button!');
    }
    // Future: add support for photo, video, etc.
    
  } catch (error) {
    console.error('❌ Failed to send post:', error.message);
    if (error.response) {
      console.error('Telegram API response:', error.response);
    }
  }
}

// ==================== SCHEDULED POSTS (IST TIMINGS) ====================
// Cron times are in UTC. Converted from IST (UTC = IST - 5:30)

// 7:45 AM IST = 2:15 UTC
cron.schedule('15 2 * * *', () => {
  console.log('⏰ Scheduled: 7:45 AM IST');
  sendRandomPost();
});

// 10:25 AM IST = 4:55 UTC
cron.schedule('55 4 * * *', () => {
  console.log('⏰ Scheduled: 10:25 AM IST');
  sendRandomPost();
});

// 1:45 PM IST = 8:15 UTC
cron.schedule('15 8 * * *', () => {
  console.log('⏰ Scheduled: 1:45 PM IST');
  sendRandomPost();
});

// 4:00 PM IST = 10:30 UTC
cron.schedule('30 10 * * *', () => {
  console.log('⏰ Scheduled: 4:00 PM IST');
  sendRandomPost();
});

// 6:45 PM IST = 13:15 UTC
cron.schedule('15 13 * * *', () => {
  console.log('⏰ Scheduled: 6:45 PM IST');
  sendRandomPost();
});

// ==================== STARTUP ====================
// Launch the bot (polling mode – works fine on Render)
bot.launch().catch((err) => {
  console.error('❌ Bot failed to start:', err);
});

// Immediately log bot started message
console.log('🤖 Avatar 3 Channel Bot started!');
console.log(`📢 Channel: ${CHANNEL_USERNAME}`);
console.log(`🔗 Main Bot: ${MAIN_BOT_USERNAME}`);
console.log('⏰ Scheduled posts at (IST): 7:45AM, 10:25AM, 1:45PM, 4:00PM, 6:45PM daily');

// Send a test post 1 minute after startup to verify everything works
setTimeout(() => {
  console.log('🧪 Sending test post...');
  sendRandomPost();
}, 60000); // 60 seconds

// ==================== GRACEFUL SHUTDOWN ====================
// Handle termination signals
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
});
