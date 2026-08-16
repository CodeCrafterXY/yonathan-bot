const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('View all pending tasks'),
        
    async execute(interaction) {
        // Grab the tasks array from the client object
        const tasks = interaction.client.tasks;

        if (tasks.length === 0) {
            return interaction.reply({ content: 'No pending tasks! 🎉', flags: MessageFlags.Ephemeral });
        }
        
        let taskList = tasks.map((t, i) => `${i + 1}. ${t}`).join('\n');
        await interaction.reply(`📋 **Your Tasks:**\n${taskList}`);
    },
};