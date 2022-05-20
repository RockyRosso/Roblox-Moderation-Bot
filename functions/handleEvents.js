module.exports = (client) => {
    client.handleEvents = async (eventFiles, path) => {
        // Get files //
        for (const file of eventFiles) {
            const event = require(`${path}/${file}`);

            // Check for event //
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}