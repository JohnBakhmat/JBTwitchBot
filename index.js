const tmi = require("tmi.js");
const _ = require("lodash");

const perks = require("./data/perks.json");
const sessions = require("./data/sessions.json");
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

const prefix = ">";

client.on("message", (channel, tags, message, self) => {
  // Ignore echoed messages.
  if (self) return;
  
  //Hello
  if (message.toLowerCase() === `${prefix}hello`) {
    client.say(channel, `@${tags.username}, Yo what's up`);
  }

  //TODO: remove multipe people from the queue

  //Open queue
  if (message.toLowerCase() === `${prefix}open`) {
    let queue = sessions.find(
      (c) => c.channel === channel.toLowerCase().trimStart()
    ).queue
    queue.isOpened = true
    queue.members = []
    client.say(channel, `@${tags.username}, queue is opened!`);
  }


  //Close queue
  if (message.toLowerCase() === `${prefix}close`) {
    let queue = sessions.find(
      (c) => c.channel === channel.toLowerCase().trimStart()
    ).queue
    queue.isOpened = false
    queue.members = []
    client.say(channel, `@${tags.username}, queue is closed!`);
  }


  //show queue
  if (message.toLowerCase() === `${prefix}who`) {
    let queue = sessions.find(
      (c) => c.channel === channel.toLowerCase().trimStart()
    ).queue;
      if(!queue.isOpened){
        client.say(channel, `Queue is currently closed!`)
      }

    client.say(channel, `Queue: ${queue.members.join(", ")}`);
  }

  

  //Join queue
  if (message.toLowerCase() === `${prefix}join`) {
    let queue = sessions.find(
      (c) => c.channel === channel.toLowerCase().trimStart()
    ).queue.members;
    let member = `@${tags.username}`;
    if (!queue.includes(member)) {
      queue.push(member);
      client.say(
        channel,
        `@${tags.username}, you are enqueued! Your position is: ${
          queue.indexOf(member) + 1
        }`
      );
    } else {
      client.say(
        channel,
        `@${tags.username}, you are already in queue! Your position is: ${
          queue.indexOf(member) + 1
        }`
      );
    }
  }


  //Leave queue
  if (message.toLowerCase() === `${prefix}leave`) {
    let queue = sessions.find(
      (c) => c.channel === channel.toLowerCase().trimStart()
    ).queue.members;
    let member = `@${tags.username}`;
    if (queue.includes(member)) {
      let newQueue = [];
      queue.forEach((element) => {
        if (element !== member) {
          newQueue.push(element);
        }
      });

      queue.members = newQueue;

      client.say(
        channel,
        `@${tags.username}, you are dequeued!`
      );
    }
  }


  //Roulette
  if (message.toLowerCase().startsWith(`${prefix}roulette`)) {
    const args = message.match(/ .*/);
    if (!!args) {
      let role = args[0].trimStart().toLowerCase();
      if (role === "s") role = "survivor";
      if (role === "k") role = "killer";

      const db = perks
        .filter((item) => item.role.toLowerCase() === role)
        .map((item) => item.perk_name);
      const build = _.sampleSize(db, 4);
      console.log(build);
      client.say(
        channel,
        `@${tags.username}, your perks are: ${build.join(", ")}`
      );
    } else {
      client.say(
        channel,
        `@${tags.username}, the command should contain atribute 'killer/survivor'`
      );
    }
  }
});
