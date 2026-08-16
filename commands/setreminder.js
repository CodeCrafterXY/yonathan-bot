const { SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreminder')
        .setDescription('Change the daily reminder time')
        .addIntegerOption(option =>
            option.setName('hour')
                .setDescription('Hour in 24h format (0-23)')
                .setMinValue(0)
                .setMaxValue(23)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minute')
                .setDescription('Minute (0-59)')
                .setMinValue(0)
                .setMaxValue(59)
                .setRequired(true)),
        
    async execute(interaction) {
        const hour = interaction.options.getInteger('hour');
        const minute = interaction.options.getInteger('minute');

        // 1. Stop the existing schedule
        if (interaction.client.reminderJob) {
            interaction.client.reminderJob.stop();
        }

        // 2. Start a new schedule with the user's chosen time
        interaction.client.reminderJob = cron.schedule(`${minute} ${hour} * * *`, () => {
            const channel = interaction.client.channels.cache.get(process.env.CHANNEL_ID);
            if (channel && interaction.client.tasks.length > 0) {
                let taskList = interaction.client.tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
                channel.send(`🔔 **Daily Task Reminder!**\nHere are your pending tasks:\n${taskList}`);
            }
        }, {
            timezone: "Asia/Jakarta" // Ensure the updated time also uses WIB
        });

        // 3. Format the time nicely for the reply (e.g., turns 9:5 into 09:05)
        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        await interaction.reply(`⏰ Reminder time updated to **${formattedTime}** (Server Time).`);
    }
};