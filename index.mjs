import fs from 'fs';
import fetch from 'node-fetch';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import 'dotenv/config';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { default: command } = await import(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.attachments.size > 0) {
        message.attachments.forEach(async attachment => {
            if (attachment.name.endsWith('.json')) {
                try {
                    const response = await fetch(attachment.url);
                    const data = await response.json();

                    // Process JSON data here
                    console.log(data);

                    // Extract wizard name
                    const wizardName = data.wizard_info?.wizard_name;

                    if (wizardName) {
                        message.channel.send(`Merci pour ton json ${wizardName}`);
                    } else {
                        message.channel.send('Wizard name not found in the JSON file.');
                    }
                } catch (error) {
                    console.error('Error processing JSON file:', error);
                    message.channel.send('There was an error processing the JSON file.');
                }
            }
        });
    }

    if (message.content.startsWith('!')) {
        const args = message.content.slice(1).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to execute that command!');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);