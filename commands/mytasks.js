const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const Task = require('../models/Task');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mytasks')
        .setDescription('View tasks assigned specifically to you'),
        
    async execute(interaction) {
        const myId = interaction.user.id;

        const myTasks = await Task.find({ assigneeId: myId }).sort({ createdAt: 1 });

        if (myTasks.length === 0) {
            return interaction.reply({ content: 'You have no assigned tasks! 🎉', flags: MessageFlags.Ephemeral });
        }
        
        let taskList = myTasks.map((t,i) => `${i + 1}. ${t.description}`).join('\n');
        await interaction.reply(`👤 **Your Assigned Tasks:**\n${taskList}`);
    },
};