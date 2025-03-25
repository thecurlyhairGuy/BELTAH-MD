const { keith } = require("../keizzah/keith");
const axios = require('axios');
const ytSearch = require('yt-search');
const conf = require(__dirname + '/../set');
const { Catbox } = require("node-catbox");
const fs = require('fs-extra');
const { downloadAndSaveMediaMessage } = require('@whiskeysockets/baileys');

keith({
  nomCom: "mp3",
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

    await zk.sendMessage(dest, {
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
