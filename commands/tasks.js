const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('View all pending tasks'),
        
    async execute(interaction) {
        // 1. MUST be the first thing here - grab the tasks array
        const tasks = interaction.client.tasks;

        // 2. Now it is safe to check the length
        if (tasks.length === 0) {
            return interaction.reply({ 
                content: 'No pending tasks! 🎉', 
                flags: MessageFlags.Ephemeral 
            });
        }
        
        let taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
        await interaction.reply(`📋 **Your Tasks:**\n${taskList}`);
    },
};