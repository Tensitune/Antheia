const Command = require("../lib/command.js");
const CATEGORY = "general";

module.exports = bot => {
  const ping = new Command("ping");
  ping.description = "Measures response time to Discord.";
  ping.category = CATEGORY;
  ping.callback = async message => {
    const newMessage = await message.channel.createMessage({
      content: "Pong.",
      allowedMentions: {
        repliedUser: false
      },
      messageReference: {
        messageID: message.id
      }  
    });
    const rtt = Math.floor(newMessage.timestamp - message.timestamp);

    await newMessage.edit({
      content: `Pong. RTT: \`${rtt}ms\``,
      allowedMentions: {
        repliedUser: false
      }  
    });
  };
  bot.registerModuleCommand(ping);
};
