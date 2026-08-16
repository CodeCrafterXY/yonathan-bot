const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('View all pending tasks'),
    
    async execute(interaction) {
        if (tasks.length === 0) {
            return interaction.reply({ content: 'No pending tasks! 🎉', ephemeral: true });
        }
        let taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
        await interaction.reply(`📋 **Your Tasks:**\n${taskList}`);
    },
};