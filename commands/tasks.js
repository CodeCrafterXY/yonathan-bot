const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const Task = require('../models/Task'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tasks')
        .setDescription('View all pending tasks and their assignees'),
        
    async execute(interaction) {
        const tasks = await Task.find().sort({ createdAt: 1 });

        if (tasks.length === 0) {
            return interaction.reply({ 
                content: 'No pending tasks! 🎉', 
                flags: MessageFlags.Ephemeral 
            });
        }
        
        // Directly format with the assignee mention
        let taskList = tasks.map((t, i) => {
            // Note: If you have old test tasks in your database from before this update, 
            // t.assigneeId might be null. This quick fallback prevents an ugly <@null> error.
            const mention = t.assigneeId ? `<@${t.assigneeId}>` : '*Legacy Task*';
            
            return `${i + 1}. **${t.description}** ━━ 👤 ${mention}`;
        }).join('\n\n');
        
        await interaction.reply(`📋 **All Server Tasks:**\n\n${taskList}`);
    },
};