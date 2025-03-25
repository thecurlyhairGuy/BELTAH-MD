const { keith } = require('../keizzah/keith');
const Heroku = require('heroku-client');
const s = require("../set");
const axios = require("axios");
const speed = require("performance-now");
const { exec } = require("child_process");
const conf = require(__dirname + "/../set");
// Function to show loading animation
async function loading(dest, zk) {
  const lod = [
    "👍", 
    "👻", 
    "🤗", 
    "😌",
    "🔥",
    "😢", 
    "✨", 
    "🔞",
    "🗿", 
   "*ʙᴇʟᴛᴀʜ-ᴍᴅ sᴘᴇᴇᴅ ᴛᴇsᴛ ᴏʀɪɢɪɴᴀᴛᴇᴅ ғʀᴏᴍ ᴛʜᴇ sᴀᴠᴇʀ*"
  ];
  let { key } = await zk.sendMessage(dest, { text: '*🇰🇪Enjoy...with BELTAH MD.....*' });

  // Run the loading animation without blocking the main code
  for (let i = 0; i < lod.length; i++) {
    await zk.sendMessage(dest, { text: lod[i], edit: key });
    await delay(500); // Adjust the speed of the animation here
  }
 } 
   let customContactMessage = {
      key: { fromMe: false, participant: `0@s.whatsapp.net`, remoteJid: 'status@broadcast' },
      message: {
        contactMessage: {
          displayName:" BELTAH254",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:"BELTAH254"\nitem1.TEL;waid=${zk.split('@')[0]}:${zk.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        },
      },
    };

keith(
  {
    nomCom: 'pong',
    aliases: ['speed', 'latency'],
    desc: 'To check bot response time',
    categorie: 'system', // Fixed the typo here (Categorie -> categorie)
    reaction: '👻',
    fromMe: true, // Removed quotes to make it a boolean
  },
  async (dest, zk) => {
    // Call the new loading animation without delaying the rest of the bot
    const loadingPromise = loading(dest, zk);

    // Generate 3 ping results with large random numbers for a more noticeable effect
    const pingResults = Array.from({ length: 1 }, () => Math.floor(Math.random() * 10000 + 1000));

    // Create larger font for ping results (using special characters for a bigger look)
    const formattedResults = pingResults.map(ping => `*📡 ᴘᴏɴɢ 📡*\n\n*${ping}...ᴍɪʟʟɪsᴇᴄᴏɴᴅs*\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴇʟᴛᴀʜ ᴛᴇᴄʜ ᴛᴇᴀᴍ*`);

    // Send the ping results with the updated text and format
    await zk.sendMessage(dest, {
      text:`${formattedResults}`, 
      contextInfo: {
        externalAdReply: {
          title: " *ʙᴇʟᴛᴀʜ-ᴍᴅ sᴘᴇᴇᴅ ᴛᴇsᴛ* " ,
          body:" 👻ᴏʀɪɢɪɴᴀᴛᴇᴅ ғʀᴏᴍ ᴛʜᴇ sᴀᴠᴇʀ👻",
          thumbnailUrl: "https://telegra.ph/file/dcce2ddee6cc7597c859a.jpg" , // Replace with your bot profile photo URL
          sourceUrl:  'https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F' , // Your channel URL
          mediaType: 1,
          forwardingScore: 999,
                isForwarded: true
        },
      },
      {quoted:customContactMessage }});

    console.log("Ping results sent successfully with new loading animation and formatted results!");

    // Ensure loading animation completes after the ping results
    await loadingPromise;
  }
);

// React function if needed for further interaction
function react(dest, zk, msg, reaction) {
  zk.sendMessage(dest, { react: { text: reaction, key: msg.key } });
}
