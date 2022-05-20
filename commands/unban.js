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

//

module.exports = {
    // Build slash command //
    data: new SlashCommandBuilder()
        .setName('unban')
		.setDescription('Unban a user')

        .addStringOption(option =>
            option
                .setName('user-id')
                .setDescription('Enter the Roblox user ID of a user you\'d want to unban')
                .setRequired(true)),

    async execute(interaction) {
        // Check for cooldown //
        if (!cooldown.has(interaction.user.id)) {
            // Variables //
            const user_id = interaction.options.getString('user-id');

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

            const NoDataEmbed = new MessageEmbed()
                .setColor(Error_Color)
                .setDescription('This user is not banned!')
                .setAuthor({ name: 'Roblox Moderation', iconURL: 'https://cdn.discordapp.com/attachments/882730721498763296/977183298868641823/Roblox_Moderation_Icon.png' })
                .setTimestamp()
                .setFooter({ text: 'Error' })

            // Attempt to unban user //
            try {
                const BanData = await BanDataStore.get(`Banned-${user_id}`);

                // Check if the key is null //
                if (BanData === null || BanData === undefined) {
                    await interaction.reply({ embeds: [NoDataEmbed] });
                    return;
                }

                BanDataStore.delete(`Banned-${user_id}`);
                await interaction.reply({ embeds: [SuccessEmbed] });
            } catch (error) {
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