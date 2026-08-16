const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a new task to the list')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('The task description')
                .setRequired(true)),
                
    async execute(interaction) {
        const task = interaction.options.getString('task');
        // We'll attach our tasks array to the client object in index.js so all commands can access it
        interaction.client.tasks.push(task); 
        await interaction.reply({ content: `✅ Task added: "${task}"` });
    },
};