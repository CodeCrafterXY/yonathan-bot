const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const Task = require('../models/Task');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donetask')
        .setDescription('Mark a task as completed')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The task number from your list')
                .setRequired(true)),
                
    async execute(interaction) {
        const index = interaction.options.getInteger('number') - 1;
        const tasks = await Task.find().sort({ createdAt: 1 });

        if (index >= 0 && index < tasks.length) {
            const taskToDelete = tasks[index];
            await Task.findByIdAndDelete(taskToDelete._id); 
            await interaction.reply(`🎉 Task completed: "${taskToDelete.description}"`);
        } else {
            await interaction.reply({ content: 'Invalid task number!', flags: MessageFlags.Ephemeral });
        }
    },
};