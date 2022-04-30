const Command = require("../lib/command.js");
const CATEGORY = "general";

module.exports = bot => {
  const help = new Command("help");
  help.description = "Lists all commands";
  help.usage = "[command] or [--category]";
  help.category = CATEGORY;
  help.callback = (_, line) => {
    const sorted = {};

    for (const cmd of bot.commands.values()) {
      const category = cmd.category.toLowerCase();
      if (!sorted[category]) {
        sorted[category] = [];
      }
      sorted[category].push(cmd);
    }

    if (line == "") {
      const embed = {
        title: "Antheia Command List",
        fields: []
      };

      for (const category in sorted) {
        embed.fields.push({
          name: category.toUpperCase().charAt(0) + category.toLowerCase().substring(1),
          value: `${sorted[category].length} commands\n\`${bot.config.prefix}help --${category.toLowerCase()}\``,
          inline: true
        });
      }

      return { embed };
    } else if (line.startsWith("--")) {
      const category = line.replace("--", "").toLowerCase().trim();

      if (sorted[category]) {
        const embed = {
          title: `Antheia Category - ${category.toUpperCase().charAt(0) + category.toLowerCase().substring(1)}`,
          fields: []
        };

        for (const cmd of sorted[category]) {
          embed.fields.push({
            name: bot.config.prefix + cmd.name,
            value: cmd.description,
            inline: true
          });
        }

        return { embed };
      } else {
        return "Category not found.";
      }
    } else {
      const cmd = bot.commands.get(line.toLowerCase().trim());

      if (cmd) {
        const embed = {
          title: `Antheia Command - ${cmd.name}`,
          description: cmd.description,
          fields: [
            {
              name: "Category",
              value: cmd.category.toUpperCase().charAt(0) + cmd.category.toLowerCase().substring(1),
              inline: true
            }
          ]
        };

        if (cmd.usage) {
          embed.fields.push({
            name: "Usage",
            value: `${bot.config.prefix}${cmd.name} ${cmd.usage}`,
            inline: true
          });
        }

        return { embed };
      } else {
        return "Command not found.";
      }
    }
  };
  bot.registerModuleCommand(help);

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
