const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('donetask')
        .setDescription('Mark a task as complete')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('The task number from your list')
                .setRequired(true)),
    
    async execute(interaction) {
        const index = interaction.options.getInteger('number') - 1;

        if (index >= 0 && index < tasks.length) {
            const completed = tasks.splice(index, 1);
            await interaction.reply(`🎉 Task Completed: "${completed}"`);
        } else {
            await interaction.reply({ content: 'Invalid task number! Check your list with `/tasks`', ephemeral: true });
        }
    },
};