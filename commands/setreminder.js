const { SlashCommandBuilder } = require('discord.js');
const cron = require('node-cron');
const Task = require('../models/Task');
const Settings = require('../models/Settings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setreminder')
        .setDescription('Change the daily reminder time')
        .addIntegerOption(option => option.setName('hour').setDescription('Hour in 24h format (0-23)').setMinValue(0).setMaxValue(23).setRequired(true))
        .addIntegerOption(option => option.setName('minute').setDescription('Minute (0-59)').setMinValue(0).setMaxValue(59).setRequired(true)),
        
    async execute(interaction) {
        const hour = interaction.options.getInteger('hour');
        const minute = interaction.options.getInteger('minute');

        await Settings.findOneAndUpdate(
            { settingId: 'global' },
            { reminderHour: hour, reminderMinute: minute },
            { upsert: true, new: true }
        );

        if (interaction.client.reminderJob) {
            interaction.client.reminderJob.stop();
        }

        interaction.client.reminderJob = cron.schedule(`${minute} ${hour} * * *`, async () => {
            const channel = interaction.client.channels.cache.get(process.env.CHANNEL_ID);
            const tasks = await Task.find().sort({ createdAt: 1 });

            if (channel && tasks.length > 0) {
                let taskList = tasks.map((t, i) => {
                    const mention = t.assigneeId ? `<@${t.assigneeId}>` : '*Legacy Task*';
                    return `${i + 1}. **${t.description}** ━━ 👤 ${mention}`;
                }).join('\n\n');
                channel.send(`🔔 **Daily Task Reminder!**\nHere are your pending tasks:\n\n${taskList}`);
            }
        }, { timezone: "Asia/Jakarta" });

        const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        await interaction.reply(`⏰ Reminder time permanently updated to **${formattedTime} WIB**.`);
    }
};