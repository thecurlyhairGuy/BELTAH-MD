const { keith } = require("../keizzah/keith");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');

// Initialize Catbox
const catbox = new Catbox();

// Function to upload a file to Catbox and return the URL
async function uploadToCatbox(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("File does not exist");
  }
  try {
    const uploadResult = await catbox.uploadFile({ path: filePath });
    if (uploadResult) {
      return uploadResult;
    } else {
      throw new Error("Error retrieving file link");
    }
  } catch (error) {
    throw new Error(String(error));
  }
}
// Define the command with aliases for play
keith({
  nomCom: "play",
  categorie: "Search",
  reaction: "🎶"
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg, auteurMessage } = commandeOptions;

  if (!arg[0]) {
    repondre("Please provide a song name or keyword.");
    return;
  }

  try {
    const songName = arg.join(" ");
    const search = await yts(songName);
    const videos = search.videos;

    if (!videos || videos.length === 0) {
      repondre('No songs found for the given name.');
      return;
    }

    const selectedVideo = videos[0];
    const videoUrl = selectedVideo.url;

    let downloadUrl;
    let title = selectedVideo.title;

    try {
      const apiUrl = `https://api.bwmxmd.online/api/download/ytmp3?apikey=ibraah-help&url=${encodeURIComponent(videoUrl)}`;
      const apiResponse = await axios.get(apiUrl);

      if (apiResponse.data && apiResponse.data.success) {
        downloadUrl = apiResponse.data.result.download_url;
      } else {
        throw new Error("Failed to fetch download URL from the new API.");
      }
    } catch (error) {
      console.error("Error fetching from the new API:", error);
      repondre("Songs API is currently unavailable. Please try again later.");
      return;
    }

    await zk.sendMessage(dest,  {
      audio: { url: downloadUrl },
      mimetype: 'audio/mpeg',
      fileName: title
    }, { quoted: ms });

    repondre(`Playing audio: ${title}`);
  } catch (error) {
    console.error('Error:', error);
    repondre('An error occurred while searching or fetching the song.');
  }
});
// Define the command with aliases for video
keith({
  nomCom: "video",
  aliases: ["videodoc", "film", "mp4"],
  categorie: "download",
  reaction: "🎥"
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
      `https://api.bwmxmd.online/api/download/ytmp3?apikey=ibraah-help&url=${encodeURIComponent(videoUrl)`, 
      `https://api-rin-tohsaka.vercel.app/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`,
      `https://api.dreaded.site/api/ytdl/video?url=${encodeURIComponent(videoUrl)}`
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
    const videoDetails = downloadData.result;

    // Prepare the message payload with external ad details
    const messagePayloads = [
      {
        video: { url: downloadUrl },
        mimetype: 'video/mp4',
        contextInfo: {
          externalAdReply: {
            title: conf.BOT,
            body: videoDetails.title,
            mediaType: 1,
            sourceUrl: conf.GURL,
            thumbnailUrl: firstVideo.thumbnail,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          },
        },
      },
      {
        document: { url: downloadUrl },
        mimetype: 'video/mp4',
        contextInfo: {
          externalAdReply: {
            title: conf.BOT,
            body: videoDetails.title,
            mediaType: 1,
            sourceUrl: conf.GURL,
            thumbnailUrl: firstVideo.thumbnail,
            renderLargerThumbnail: false,
            showAdAttribution: true,
          },
        },
      }
    ];

    // Send the download link to the user
    for (const messagePayload of messagePayloads) {
      await zk.sendMessage(dest, messagePayload, { quoted: ms });
    }

  } catch (error) {
    console.error('Error during download process:', error);
    return repondre(`Download failed due to an error: ${error.message || error}`);
  }
});


// Command to upload image, video, or audio file
keith({
  'nomCom': 'tourl',       // Command to trigger the function
  'categorie': "download", // Command category
  'reaction': '👨🏿‍💻'    // Reaction to use on command
}, async (groupId, client, context) => {
  const { msgRepondu, repondre } = context;

  // If no message (image/video/audio) is mentioned, prompt user
  if (!msgRepondu) {
    return repondre("Please mention an image, video, or audio.");
  }

  let mediaPath;

  // Check if the message contains a video
  if (msgRepondu.videoMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
  }
 else if (msgRepondu.gifMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.gifMessage);
  }
 else if (msgRepondu.stickerMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
  }
else if (msgRepondu.documentMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.documentMessage);
  }
  // Check if the message contains an image
  else if (msgRepondu.imageMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
  }
  // Check if the message contains an audio file
  else if (msgRepondu.audioMessage) {
    mediaPath = await client.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
  } else {
    // If no media (image, video, or audio) is found, prompt user
    return repondre("Please mention an image, video, or audio.");
  }

  try {
    // Upload the media to Catbox and get the URL
    const fileUrl = await uploadToCatbox(mediaPath);

    // Delete the local media file after upload
    fs.unlinkSync(mediaPath);

    // Respond with the URL of the uploaded file
    repondre(fileUrl);
  } catch (error) {
    console.error("Error while creating your URL:", error);
    repondre("Oops, there was an error.");
  }
});
