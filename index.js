require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const cron = require('node-cron');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Attach our tasks array and commands collection to the client so files can access them
client.tasks = []; 
client.commands = new Collection();

// Dynamically load command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Register commands to Discord API
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        const commandData = client.commands.map(c => c.data.toJSON());
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandData },
        );
        console.log('Successfully registered global slash commands.');
    } catch (error) {
        console.error('Failed to register commands:', error);
    }

    // We attach the job to client.reminderJob so we can stop it later
    client.reminderJob = cron.schedule('0 9 * * *', () => {
        const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        if (channel && client.tasks.length > 0) {
            let taskList = client.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
            channel.send(`🔔 **Daily Task Reminder!**\nHere are your pending tasks:\n${taskList}`);
        }
    }, {
        timezone: "Asia/Jakarta" // This forces the cron job to run in WIB
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);