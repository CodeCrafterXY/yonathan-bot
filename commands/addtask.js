const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a new task to the list')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('The Task description')
                .setRequired(true)),
    
    async execute(interaction) {
        const task = interaction.options.getString('task');
        interaction.client.tasks.push(task); 
        await interaction.reply({ content: `✅ Task added: "${task}"` });
    },
};