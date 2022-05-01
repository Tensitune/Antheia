const Eris = require("eris");
const config = require("../config.json");
const Command = require("./lib/command");

const fs = require("fs");
const { resolve } = require("path");

const bot = new Eris(config.token, { intents: Object.keys(Eris.Constants.Intents) });

bot.config = config;
bot.commands = new Eris.Collection();

bot.registerModuleCommand = cmdObj => {
  if (cmdObj instanceof Command) {
    bot.commands.set(cmdObj.name, cmdObj);
    console.log(`Registered command '${cmdObj.name}'`);
  }
};

const CommandHandler = require("./lib/commandHandler")(bot);

bot.on("ready", async () => {
  console.log("Connected to Discord.");
  console.log(`Logged in as: ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`);
  
  for (const file of fs.readdirSync(resolve(__dirname, "modules"))) {
    require(resolve(__dirname, "modules", file))(bot);
    console.log(`Loaded module: '${file}'`);
  }  
});

bot.on("messageCreate", async message => {
  if (message.channel instanceof Eris.Channel) {
    await CommandHandler(message);
  }
});

bot.on("error", err => {
  console.error("Catching error: " + err);
});

bot.on("warn", err => {
  console.warn("Catching warn: " + err);
});

bot.connect();
