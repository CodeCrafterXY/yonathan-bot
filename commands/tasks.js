const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const Task = require('../models/Task');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('View all pending tasks'),
        
    async execute(interaction) {
        const tasks = await Task.find().sort({ createdAt: 1 });

        if (tasks.length === 0) {
            return interaction.reply({ content: 'No pending tasks! 🎉', flags: MessageFlags.Ephemeral });
        }
        
        // Change this inside your tasks.js execute function:
        let taskList = tasks.map((t, i) => {
            if (t.assigneeId) return `${i + 1}. <@${t.assigneeId}> - ${t.description}`;
            return `${i + 1}. ${t.description}`;
        }).join('\n');
        
        await interaction.reply(`📋 **Your Tasks:**\n${taskList}`);
    },
};