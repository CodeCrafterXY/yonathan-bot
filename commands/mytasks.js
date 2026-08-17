const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mytasks')
        .setDescription('View tasks assigned specifically to you'),
        
    async execute(interaction) {
        const tasks = interaction.client.tasks;
        const myId = interaction.user.id;
        
        const myTasks = tasks
            .map((t, i) => ({ originalIndex: i + 1, ...t }))
            .filter(t => t.assigneeId === myId);

        if (myTasks.length === 0) {
            return interaction.reply({ 
                content: 'You have no assigned tasks! 🎉', 
                flags: MessageFlags.Ephemeral 
            });
        }
        
        let taskList = myTasks.map(t => `${t.originalIndex}. ${t.description}`).join('\n');
        await interaction.reply(`👤 **Your Assigned Tasks:**\n${taskList}`);
    },
};