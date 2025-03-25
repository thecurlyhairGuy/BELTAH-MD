const { keith } = require("../keizzah/keith");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');

keith({
  nomCom: "play",
  aliases: ["song", "playdoc", "audio", "mp3"],
  categorie: "Search",
  reaction: "🗿"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  // Check if a query is provided
  if (!arg[0]) {
    return repondre("Please provide a video name.");
  }

  const query = arg.join(" ");

  try {
    // Perform a YouTube search based on the query
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return repondre('No video found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Function to get download data from APIs
    const getDownloadData = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data from API:', error);
        return { success: false };
      }
    };

    // List of APIs to try
    const apis = [
      `https://api-rin-tohsaka.vercel.app/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`
      `https://api.bwmxmd.online/api/download/ytmp3?apikey=ibraah-help&url=${encodeURIComponent(videoUrl)`
    ];

    let downloadData;
    for (const api of apis) {
      downloadData = await getDownloadData(api);
      if (downloadData && downloadData.success) break;
    }

    // Check if a valid download URL was found
    if (!downloadData || !downloadData.success) {
      return repondre('Failed to retrieve download URL from all sources. Please try again later.');
    }

    const downloadUrl = downloadData.result.download_url;
    const songTitle = downloadData.result.title;
    const videoThumbnail = firstVideo.thumbnail;
    const videoChannel = downloadData.result.author;
    const videoPublished = downloadData.result.uploadDate;
    const videoViews = downloadData.result.viewCount;

    // Prepare the message with song details
    const messagePayload = {
      caption: `╭───────────────━⊷
 ║ 🛸 ʙᴇʟᴛᴀʜ-ᴍᴅ ᴀᴜᴅɪᴏ ᴘʟᴀʏᴇʀ 🛸 
╰───────────────━⊷
╭───────────────◆
│⿻ *ᴛɪᴛʟᴇ:* ${songTitle} 
│⿻ *ǫᴜᴀʟɪᴛʏ:* ʜɪɢʜ
│⿻ *ᴅᴜʀᴀᴛɪᴏɴ:* ${firstVideo.timestamp}
╰────────────────◆
⦿ *ᴅɪʀᴇᴄᴛ ʏᴛʟɪɴᴋ:* ${videoUrl} 

╭───────────────━⊷
║ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴇʟᴛᴀʜ ᴛᴇᴄʜ ᴛᴇᴀᴍ 
╰───────────────━⊷`,
      document: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: " 🛸 ʙᴇʟᴛᴀʜ-ᴍᴅ ᴘʟᴀʏᴇʀ 🛸" ,
            body: songTitle ,
            mediaType: 1,
            sourceUrl:"https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
            thumbnailUrl: firstVideo.thumbnail,
            renderLargerThumbnail: false,
            showAdAttribution: true,
        }
      }
    };

    await zk.sendMessage(dest, messagePayload, { quoted: ms });

  } catch (error) {
    console.error('Error during download process:', error);
    return repondre(`Download failed due to an error: ${error.message || error}`);
  }
});

//Video download script
keith({
  nomCom: "video",
  aliases: ["mp4", "videodoc", "videos"],
  categorie: "Search",
  reaction: "🗿"
}, async (dest, zk, commandOptions) => {
  const { arg, ms, repondre } = commandOptions;

  // Check if a query is provided
  if (!arg[0]) {
    return repondre("Please provide a video name.");
  }

  const query = arg.join(" ");

  try {
    // Perform a YouTube search based on the query
    const searchResults = await ytSearch(query);

    // Check if any videos were found
    if (!searchResults || !searchResults.videos.length) {
      return repondre('No video found for the specified query.');
    }

    const firstVideo = searchResults.videos[0];
    const videoUrl = firstVideo.url;

    // Function to get download data from APIs
    const getDownloadData = async (url) => {
      try {
        const response = await axios.get(url);
        return response.data;
      } catch (error) {
        console.error('Error fetching data from API:', error);
        return { success: false };
      }
    };

    // List of APIs to try
    const apis = [
      `https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${encodeURIComponent(videoUrl)}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?url=${encodeURIComponent(videoUrl)}&apikey=gifted-md`,
      `https://api.dreaded.site/api/ytdl/audio?url=${encodeURIComponent(videoUrl)}`
      `https://api.bwmxmd.online/api/download/ytmp4?apikey=ibraah-help&url=${encodeURIComponent(videoUrl)`
    ];

    let downloadData;
    for (const api of apis) {
      downloadData = await getDownloadData(api);
      if (downloadData && downloadData.success) break;
    }

    // Check if a valid download URL was found
    if (!downloadData || !downloadData.success) {
      return repondre('Failed to retrieve download URL from all sources. Please try again later.');
    }

    const downloadUrl = downloadData.result.download_url;
    const songTitle = downloadData.result.title;
    const videoThumbnail = firstVideo.thumbnail;
    const videoChannel = downloadData.result.author;
    const videoPublished = downloadData.result.uploadDate;
    const videoViews = downloadData.result.viewCount;

    // Prepare the message with song details
    const messagePayload = {
      caption: `╭───────────────━⊷
 ║ 🛸 ʙᴇʟᴛᴀʜ-ᴍᴅ ᴘʟᴀʏᴇʀ 🛸 
╰───────────────━⊷
╭───────────────◆
│⿻ *ᴛɪᴛʟᴇ:* ${songTitle} 
│⿻ *ǫᴜᴀʟɪᴛʏ:* ʜɪɢʜ
│⿻ *ᴅᴜʀᴀᴛɪᴏɴ:* ${firstVideo.timestamp}
╰────────────────◆
⦿ *ᴅɪʀᴇᴄᴛ ʏᴛʟɪɴᴋ:* ${videoUrl} 

╭───────────────━⊷
║ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʙᴇʟᴛᴀʜ ᴛᴇᴄʜ ᴛᴇᴀᴍ 
╰───────────────━⊷`,
      document: { url: downloadUrl },
        mimetype: 'video/mp4',
        contextInfo: {
          externalAdReply: {
            title: " 🛸 ʙᴇʟᴛᴀʜ-ᴍᴅ ᴘʟᴀʏᴇʀ 🛸" ,
            body: songTitle ,
            mediaType: 1,
            sourceUrl:"https://whatsapp.com/channel/0029VaRHDBKKmCPKp9B2uH2F",
            thumbnailUrl: firstVideo.thumbnail,
            renderLargerThumbnail: false,
            showAdAttribution: true,
        }
      }
    };

    await zk.sendMessage(dest, messagePayload, { quoted: ms });

  } catch (error) {
    console.error('Error during download process:', error);
    return repondre(`Download failed due to an error: ${error.message || error}`);
  }
}); 
