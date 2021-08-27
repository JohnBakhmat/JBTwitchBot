const tmi = require("tmi.js");
const axios = require("axios");
const _ = require("lodash");
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "BakhmatBot",
    password: "oauth:5b12wyhx1jp47uloxtzw6ro355s32m",
  },
  channels: ["johnbakhmat"],
});
client.connect();

// let prefixes = [{channel:"johnbakhmat",prefix:"?"}];
const prefix = ">";

client.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;

  if (message.toLowerCase() === `${prefix}hello`) {
    client.say(channel, `@${tags.username}, Yo what's up`);
  }
  // // TODO SetPrefix
  // if (message.toLowerCase().startsWith(`${prefix}setPrefix`)) {
  //   const args = message.match(/ .*/);
  //   if (!!args) {

  //     const newPrefix = args[0].trimStart();
  //     if(newPrefix.length!==1) return

  //     if (prefixes.map((c) => c.channel).includes(channel)) {
  //       console.log(prefixes.find((obj) => obj.channel == channel).prefix);
  //     }
  //   }
  // }

  //Roulette
  if (message.toLowerCase().startsWith(`${prefix}roulette`)) {
    const args = message.match(/ .*/);
    if (!!args) {
      let role = args[0].trimStart().toLowerCase();
      if (role === "s") role = "survivor";
      if (role === "k") role = "killer";

      axios
        .get("https://dbd-api.herokuapp.com/perks?lang=en")
        .then((resp) => {
          const db = resp.data
            .filter(item.role.toLowerCase() === role)
            .map((item) => item.perk_name);
          const build = _.sampleSize(db, 4);
          console.log(build);
          client.say(
            channel,
            `@${tags.username}, your perks are: ${build.join(", ")}`
          );
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      client.say(
        channel,
        `@${tags.username}, the command should contain atribute 'killer/survivor'`
      );
    }
  }
});
