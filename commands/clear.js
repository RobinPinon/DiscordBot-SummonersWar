export default {
    name: 'clear',
    description: 'Deletes all messages in the channel',
    async execute(message, args) {
        // // Check if the bot has the necessary permissions
        // if (!message.guild.me.permissions.has('MANAGE_MESSAGES')) {
        //     return message.reply('I do not have permission to manage messages!');
        // }

        // // Check if the user has the necessary permissions
        // if (!message.member.permissions.has('MANAGE_MESSAGES')) {
        //     return message.reply('You do not have permission to manage messages!');
        // }

        const channel = message.channel;

        // Fetch and delete messages in batches
        let fetched;
        do {
            fetched = await channel.messages.fetch({ limit: 100 });
            await channel.bulkDelete(fetched, true);
        } while (fetched.size >= 2);

        message.channel.send('All messages have been deleted.');
    },
};