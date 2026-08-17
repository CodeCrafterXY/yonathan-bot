const { SlashCommandBuilder } = require('discord.js');
const Task = require('../models/Task'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a new task and assign it to a member')
        .addStringOption(option => 
            option.setName('task')
                .setDescription('The task description')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('assignee')
                .setDescription('The member responsible for this task')
                .setRequired(true)), // Now required!
                
    async execute(interaction) {
        const taskDesc = interaction.options.getString('task');
        const assignee = interaction.options.getUser('assignee');
        
        // Save to MongoDB, assignee is guaranteed to exist
        await Task.create({
            description: taskDesc,
            assigneeId: assignee.id
        }); 
        
        await interaction.reply({ content: `✅ Task added and assigned to ${assignee}: "${taskDesc}"` });
    },
};