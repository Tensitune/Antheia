function parseArguments(str) {
  return str.match(/\\?.|^$/g).reduce(
    (prev, curr) => {
      if (curr === '"') {
        prev.quote ^= 1;
      } else if (!prev.quote && curr === " ") {
        prev.args.push("");
      } else {
        prev.args[prev.args.length - 1] += curr.replace(/\\(.)/, "$1");
      }

      return prev;
    },
    { args: [""] }
  ).args;
}

module.exports = bot => {
  async function run(message, cmd, line, args) {
    const command = bot.commands.get(cmd);
    if (!command) return "Command not found.";

    if (!message.guildID) {
      return "This command can only be used in guilds.";
    }

    if (!command.checkRestrictions(message.member)) {
      return "You don't have permissions to use this command.";
    }
    
    try {
      return await command.callback(message, line, ...args);
    } catch (err) {
      console.error(err);
      return ":warning: An internal error occurred.";
    }
  }

  return async function CommandHandler(message) {
    const prefix = bot.config.prefix;
    let content = message.content;
  
    if (content.startsWith(prefix)) {
      content = content.substring(prefix.length);
      
      let line = content.split(" ");
      let [cmd] = line.splice(0, 1);
      cmd = cmd.toLowerCase();
      line = line.join(" ");
      
      const args = parseArguments(line);

      try {
        const response = await run(message, cmd, line, args);
        if (response != null) {
          let file;
          
          if (response.file) {
            file = response.file;
            delete response.file;
          }

          if (response.embed) {
            response.embeds = [...(response.embeds ?? []), response.embed];
            delete response.embed;
          }
          
          if (response.embeds) {
            for (const embed of response.embeds) {
              embed.color = 0xFAA06E;
            }
          }

          if (response.reaction) {
            message.addReaction(response.reaction);
          } else {
            const responseMessage = await message.channel.createMessage(
              Object.assign(
                typeof response === "string" ? { content: response } : response,
                {
                  allowedMentions: {
                    repliedUser: false
                  },
                  messageReference: {
                    messageID: message.id
                  }
                }
              ),
              file
            );

            if (response.addReactions) {
              for (const index in response.addReactions) {
                const reaction = response.addReactions[index];
                await responseMessage.addReaction(reaction);
              }
            }
          }
        }
      } catch (err) {
        message.channel.createMessage({ content: ":warning: An internal error occurred." });
        console.error(err);
      }
    }
  };
};
