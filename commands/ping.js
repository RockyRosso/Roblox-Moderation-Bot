// Variables

const { SlashCommandBuilder } = require('@discordjs/builders');
const cooldown = new Set();

//

module.exports = {
    // Build slash command //
    data: new SlashCommandBuilder()
        .setName('ping')
		.setDescription('Check if the bot is responsive'),

    async execute(interaction) {
        // Check for cooldown //
        if (!cooldown.has(interaction.user.id)) {

            await interaction.reply({ content: 'Pong!', ephemeral: true });

            // Set cooldown //
            cooldown.add(interaction.user.id);
            setTimeout(() => {
                cooldown.delete(interaction.user.id)
            }, 10000)
        }
    },
};