const Eris = require("eris");
const config = require("../config.json");

const bot = new Eris(config.token, {
  defaultImageFormat: "png",
  defaultImageSize: 1024,
  intents: Object.keys(Eris.Constants.Intents)
});

bot.on("ready", async () => {
  console.log("Connected to Discord.");
  console.log(`Logged in as: ${bot.user.username}#${bot.user.discriminator} (${bot.user.id})`);
});

bot.connect();
