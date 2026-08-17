const { SlashCommandBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('Send a private message to any user by their Discord ID (Developer Only)')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The exact Discord User ID of the recipient')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
                .setDescription('The message you want to send')
                .setRequired(true)),
                
    async execute(interaction) {
        // SECURITY CHECK: If the user is not you, block the command
        if (interaction.user.id !== process.env.DEVELOPER_ID) {
            return interaction.reply({
                content: '❌ **Access Denied.** This command is restricted to the bot developer.',
                flags: MessageFlags.Ephemeral
            });
        }

        const userId = interaction.options.getString('userid');
        const messageContent = interaction.options.getString('message');
        
        if (!/^\d+$/.test(userId)) {
            return interaction.reply({
                content: '❌ Invalid format! Please provide a valid Discord User ID (a long number).',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            const recipient = await interaction.client.users.fetch(userId);
            const dmContent = `${messageContent}`;

            await recipient.send(dmContent);
            
            await interaction.reply({ 
                content: `✅ Successfully sent your direct message to **${recipient.username}**!`, 
                flags: MessageFlags.Ephemeral 
            });
            
        } catch (error) {
            console.error(`Could not send DM to ID ${userId}:`, error.message);
            
            if (error.code === 10013) {
                await interaction.reply({ 
                    content: `❌ I couldn't find a user with that ID. Make sure I share at least one server with them!`, 
                    flags: MessageFlags.Ephemeral 
                });
            } else {
                await interaction.reply({ 
                    content: `❌ I found the user, but couldn't DM them. They likely have Direct Messages disabled in their privacy settings.`, 
                    flags: MessageFlags.Ephemeral 
                });
            }
        }
    },
};