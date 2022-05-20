module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        // Check for interaction type //
        if (interaction.isCommand()) {
            // Variables //
            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            // Attempt to check for command permissions and execute command //
            try {
                if (command.permissions && command.permissions.length > 0) {
                    if (!interaction.member.permissions.has(command.permissions)) return await interaction.reply({ content: 'You do not have permission to run this command!', ephemeral: true });
                }
    
                // Execute command //
                await command.execute(interaction);
            } catch(error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command', ephemeral: true });
            }
        }
    }
}