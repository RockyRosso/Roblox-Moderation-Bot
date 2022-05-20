// Variables

const { SlashCommandBuilder } = require('@discordjs/builders');
const cooldown = new Set();

const { MessageEmbed } = require('discord.js');

const Error_Color = '#e10000';
const Success_Color = '#29dc00';

require('dotenv').config();
const UniverseID = process.env.UniverseID;
const APIKey = process.env.APIKey;

const { OpenCloudDataStore } = require('rblx');

// Get data store //
const BanDataStore = new OpenCloudDataStore(UniverseID, 'BanDataStore');
BanDataStore.authenticate(APIKey);

const BanData = {
    IsBanned: true,
    reason: 'You\'ve been banned'
};

//

module.exports = {
    // Build slash command //
    data: new SlashCommandBuilder()
        .setName('ban')
		.setDescription('Ban a user')

        .addStringOption(option =>
            option
                .setName('user-id')
                .setDescription('Enter the Roblox user ID of a user you\'d want to ban')
                .setRequired(true))
        
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Enter a reason for the ban')
                .setRequired(false)),

    async execute(interaction) {
        // Check for cooldown //
        if (!cooldown.has(interaction.user.id)) {
            // Variables //
            const user_id = interaction.options.getString('user-id');
            const reason = interaction.options.getString('reason');

            // Create Embeds //
            const SuccessEmbed = new MessageEmbed()
                .setColor(Success_Color)
                .setDescription('Successfully banned user!')
                .setAuthor({ name: 'Roblox Moderation', iconURL: 'https://cdn.discordapp.com/attachments/882730721498763296/977183298868641823/Roblox_Moderation_Icon.png' })
                .setTimestamp()
                .setFooter({ text: 'Success' })

            const ErrorEmbed = new MessageEmbed()
                .setColor(Error_Color)
                .setDescription('Failed to ban user!')
                .setAuthor({ name: 'Roblox Moderation', iconURL: 'https://cdn.discordapp.com/attachments/882730721498763296/977183298868641823/Roblox_Moderation_Icon.png' })
                .setTimestamp()
                .setFooter({ text: 'Error' })

            // Check if reason is null //
            if (reason != null) {
                BanData.reason = reason;
            }

            // Attempt to ban user //
            try {
                BanDataStore.set(`Banned-${user_id}`, BanData);
                await interaction.reply({ embeds: [SuccessEmbed] });
            } catch (error) {
                console.error(error);
                await interaction.reply({ embeds: [ErrorEmbed], ephemeral: true });
            }

            // Set cooldown //
            cooldown.add(interaction.user.id);
            setTimeout(() => {
                cooldown.delete(interaction.user.id)
            }, 10000)
        }
    },
};