const Eris = require("eris");
const config = require("../config.json");
const Command = require("./lib/command");

const bot = new Eris(config.token, {
  defaultImageFormat: "png",
  defaultImageSize: 1024,
  intents: Object.keys(Eris.Constants.Intents)
});

bot.optionTypes = {
  SUB_COMMAND:	1,	
  SUB_COMMAND_GROUP:	2,	
  STRING:	3,	
  INTEGER:	4,
  BOOLEAN:	5,	
  USER:	6,	
  CHANNEL:	7,
  ROLE:	8,	
  MENTIONABLE:	9,
  NUMBER:	10,
  ATTACHMENT: 11
};

bot.slashCommands = [];
bot.registerSlashCommand = cmdObj => {
  if (!(cmdObj instanceof Command)) return;

  bot.createGuildCommand(config.guildId, {
    name: cmdObj.name,
    description: cmdObj.description,
    type: 1
  })
  .then(() => console.log(`Registered command '${cmdObj.name}'`))
  .catch(console.error);

  bot.slashCommands.push(cmdObj);
};

bot.on("ready", async () => {
  console.log("Connected to Discord.");
  console.log(`Logged in as: ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`);
  
  require("./modules")(bot);
});

bot.on("interactionCreate", async interaction => {
  if (!(interaction instanceof Eris.CommandInteraction)) return;

  for (let i = 0; i < bot.slashCommands.length; i++) {
    const slashCommand = bot.slashCommands[i];
    if (interaction.data.name === slashCommand.name) {
      slashCommand.callback(interaction, ...slashCommand.arguments);
      break;
    }
  }
});

bot.connect();
