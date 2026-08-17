const { SlashCommandBuilder } = require('discord.js');
const Task = require('../models/Task');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a new task to the list')
        .addStringOption(option => option.setName('task').setDescription('The task description').setRequired(true))
        .addUserOption(option => option.setName('assignee').setDescription('The member you want to assign this task to').setRequired(false)),
                
    async execute(interaction) {
        const taskDesc = interaction.options.getString('task');
        const assignee = interaction.options.getUser('assignee');
        
        await Task.create({
            description: taskDesc,
            assigneeId: assignee ? assignee.id : null
        });
        
        if (assignee) {
            await interaction.reply({ content: `✅ Task added and assigned to ${assignee}: "${taskDesc}"` });
        } else {
            await interaction.reply({ content: `✅ Task added: "${taskDesc}"` });
        }
    },
};