export default {
    name: 'ping',
    description: 'Ping command',
    execute(message, args) {
        message.channel.send('Pong!');
    },
};