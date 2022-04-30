const Command = require("../lib/command");
const CATEGORY = "misc";

const translate = require("@vitalets/google-translate-api");

module.exports = bot => {
  const tr = new Command("translate");
  tr.description = "Translates text with Google Translate";
  tr.usage = "[text] or <iso-language> \"[text]\"";
  tr.category = CATEGORY;
  tr.callback = async (message, line, iso, text) => {
    let language = "en";
    let res;

    if (iso && translate.languages.isSupported(iso) && text) {
      res = await translate(text, { to: iso, autoCorrect: true });
      language = iso;
    } else {
      res = await translate(line, { to: language, autoCorrect: true });
    }

    return `${translate.languages[language]}: \`${res.text}\``;
  };
  bot.registerModuleCommand(tr);
};
