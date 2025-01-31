const { exec } = require('child_process');

const { keith } = require("../keizzah/keith")
//const { getGroupe } = require("../data/groupe")
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const {ajouterOuMettreAJourJid,mettreAJourAction,verifierEtatJid} = require("../data/antilien")
const {atbajouterOuMettreAJourJid,atbverifierEtatJid} = require("../data/antibot")
//const fs = require("fs");
const { search, download } = require("aptoide-scraper");
const fs = require("fs-extra");
const conf = require("../set");
const { default: axios } = require('axios');
//const { uploadImageToImgur } = require('../france/imgur');
const {getBinaryNodeChild, getBinaryNodeChildren} = require('@whiskeysockets/baileys').default;

keith({
  nomCom: "vcf",
  aliases: ["savecontact", "savecontacts"], // Adding aliases
  categorie: 'Group',
  reaction: "🎉"
}, async (dest, zk, commandeOptions) => {
  const { repondre, verifGroupe, verifAdmin, ms } = commandeOptions;
  const fs = require('fs');

  if (!verifAdmin) {
    repondre("You are not an admin here!");
    return;
  }

  if (!verifGroupe) {
    repondre("This command works in groups only");
    return;
  }

  try {
    let metadat = await zk.groupMetadata(dest);
    const partic = await metadat.participants;

    let vcard = '';
    let noPort = 0;

    for (let a of partic) {
      // Get the participant's phone number
      let phoneNumber = a.id.split("@")[0];

      // Use the participant's name or default to "[FMD] Phone Number" if no name is found
      let contactName = a.name || a.notify || `[BELTAH-MD] +${phoneNumber}`;

      vcard += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL;type=CELL;type=VOICE;waid=${phoneNumber}:+${phoneNumber}\nEND:VCARD\n`;
    }

    let cont = './contacts.vcf';

    await repondre(`A moment, *BELTAH-MD* is compiling ${partic.length} contacts into a vcf...`);

    await fs.writeFileSync(cont, vcard.trim());

    await zk.sendMessage(dest, {
      document: fs.readFileSync(cont),
      mimetype: 'text/vcard',
      fileName: `${metadat.subject}.Vcf`,
      caption: `𝐁𝐄𝐋𝐓𝐀𝐇 𝐌𝐃\n\nVCF for ${metadat.subject}\nTotal Contacts: ${partic.length}\n*KEEP USING BELTAH-MD*`
    }, { ephemeralExpiration: 86400, quoted: ms });

    fs.unlinkSync(cont);
  } catch (error) {
    console.error("Error while creating or sending VCF:", error.message || error);
    repondre("An error occurred while creating or sending the VCF. Please try again.");
  }
});
