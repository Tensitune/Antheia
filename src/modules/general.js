const Command = require("../lib/command.js");
const CATEGORY = "general";

module.exports = bot => {
  const ping = new Command("ping");
  ping.description = "Measures response time to Discord.";
  ping.category = CATEGORY;
  ping.callback = async interaction => {
    await interaction.createMessage({ content: "Pong." });
    
    const originalMsg = await interaction.getOriginalMessage();
    const rtt = Math.floor(originalMsg.timestamp - interaction.createdAt);

    await interaction.editOriginalMessage({
      content: `Pong. RTT: \`${rtt}ms\``,
      allowedMentions: {
        users: false
      }
    });
  };
  bot.registerSlashCommand(ping);
};
