// BELTAH MD DID EVERYTHING ,,,DO NOT COPY ...
if (!superUser && origineMessage  === auteurMessage && conf.AUTO_REACT === "yes") {
const emojis = ['👣', '🏗️', '✈️', '🌽', '🏸', '🛖', '🍁', '🛰️', '🥔', '🎡', '🎸', '🎼', '🔉', '📿', '🪇', '📹', '🎞️', '🪔', '📔', '🏷️', '💰', '📥', '🗳️', '📭', '🖌️', '📏', '', '🪛', '🔨', '⛓️‍💥', '📌', '🗝️', '🔍', '🥁', '🔊', '🥾', '👢', '🩰', '👡', '🙂', '🎊', '🎉', '🎁', '⛑️', '👋']
         const emokis = emojis[Math.floor(Math.random() * (emojis.length))]
         zk.sendMessage(origineMessage, {
             react: {
                 text: emokis,
                 key: ms.key
             }
         })
  }
