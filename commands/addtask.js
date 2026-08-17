const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtask')
        .setDescription('Add a new task to the list')
        .addStringOption(option =>
            option.setName('task')
                .setDescription('The task description')
                .setRequired(true))
        .addUserOption(option => 
            option.setName('assignee')
                .setDescription('The member you want to assign this task to')
                .setRequired(false)
        ),
    async execute(interaction) {
        const taskDesc = interaction.options.getString('task');
        const assignee = interaction.options.getUser('assignee');

        let finalTask = taskDesc;
        if (assignee) {
            finalTask = `${assignee} - ${taskDesc}`;
        }
        // We'll attach our tasks array to the client object in index.js so all commands can access it
        interaction.client.tasks.push(finalTask);
        if (assignee) {
            await interaction.reply({ content: `✅ Task added and assigned to ${assignee}: "${taskDesc}"` });
        } else {
            await interaction.reply({ content: `✅ Task added: "${taskDesc}"` });
        }
    },
};