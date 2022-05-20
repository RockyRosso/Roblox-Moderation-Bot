// Variables

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
require('dotenv').config();

const token = process.env.BotToken;

const clientId = process.env.clientID;
const guildId = process.env.guildID;

//

module.exports = (client) => {
    client.handleCommands = async (commands, path) => {
        // Get command files //
        client.commandArry = [];

        const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`${path}/${file}`);
            client.commands.set(command.data.name, command);
            client.commandArry.push(command.data.toJSON());
        }

        // Reload slash commands //
        const rest = new REST({ version: '9' }).setToken(token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands');

                await rest.put(
                    Routes.applicationGuildCommands(clientId, guildId),
                    { body: client.commandArry },
                );

                console.log('Successfully reloaded application (/) commands!');
            } catch (error) {
                console.error(error);
            }
        })();
    }
}