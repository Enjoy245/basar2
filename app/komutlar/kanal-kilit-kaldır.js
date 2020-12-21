const Discord = require('discord.js');
 
exports.run = (client, message, args) => {// can#0002
if(!message.member.hasPermission('MANAGE_CHANNELS')) return;

let channel = message.mentions.channels.first() || message.channel;
message.channel.send(`:beginner: Kilitlenen ${channel} şimdi açıldı!`).then(m => m.delete({timeout: 7000}));

let everyone = message.guild.roles.cache.find(a => a.name === '@everyone');
channel.updateOverwrite(everyone, { 'SEND_MESSAGES': null }, 'Kilitleyen: '+message.author.tag);
channel.send(new Discord.MessageEmbed()
.setColor('GREEN')
.setTitle(channel.name+' başarıyla kilidi açıldı.')
.setDescription(`:star: Bu kanal keşke daha önce açılsaydı, Ah AlieN ah..`));

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};
 
exports.help = {
  name: 'unlock'
};// codearius - alien.xxl