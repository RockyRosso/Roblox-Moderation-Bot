// Variables

const discord = require('discord.js');
const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs');

require('dotenv').config();
const token = process.env.BotToken;

//

// Create collections

client.commands = new discord.Collection();

//

// Get files from folders

const functions = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commands = fs.readdirSync('./commands');

//

// Run bot

(async () => {
    // Get files //
    for (const file of functions) {
        require(`./functions/${file}`)(client);
    }

    // Run files //
    client.handleEvents(events, '../events');
    client.handleCommands(commands, '../commands');

    // Log into bot //
    client.login(token);
})();

//