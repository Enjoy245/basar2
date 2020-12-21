const Discord = require('discord.js');
const db = require('quick.db')
 //CodeArius
exports.run = async (client, message, args) => {
  
  
  let kayityetkili = 'YETKİLİ ROL İD' //Kayıt yetkilisi İD
  
  
  if(!message.member.roles.cache.has(kayityetkili)) 
  return message.channel.send(`Bu komutu kullanabilmek için \`Kayıt\` yetkisine sahip olmalısınız.`);
   //CodeArius
  let kişi = message.mentions.users.first();
  if(!kişi) {
    let erkek = await db.fetch(`kayıte_${message.author.id}`) || '0'
    let kız = await db.fetch(`kayıtk_${message.author.id}`) || '0'
    let toplam = await db.fetch(`kayıttoplam_${message.author.id}`) || '0'
 //CodeArius
    let kayıtlılar = new Discord.MessageEmbed()
      .setColor('f5f5f5')
      .setDescription(`Teyit bilginiz\n\n`)
      .addField('__Erkek__', erkek, true) //CodeArius
      .addField('__Kız__', kız, true)
      .addField('__Toplam__', toplam)
    message.channel.send(kayıtlılar)
  }
    if(kişi) { //CodeArius
    let erkek = await db.fetch(`kayıte_${kişi.id}`) || '0'
    let kız = await db.fetch(`kayıtk_${kişi.id}`) || '0'
    let toplam = await db.fetch(`kayıttoplam_${kişi.id}`) || '0'
    let kayıtlılar = new Discord.MessageEmbed()
      .setColor('f5f5f5') //CodeArius
      .setDescription(`**${kişi.username} kişisinin teyit bilgisi**\n\n`)
      .addField('__Erkek__', erkek, true) //CodeArius
      .addField('__Kız__', kız, true)
      .addField('__Toplam__', toplam)
    message.channel.send(kayıtlılar)
  } //CodeArius
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['ks','teyit'],
  permLevel: 0
}
exports.help = {
  name: 'kayıtsay',
  description: "Teyit sayısını gösterir",
  usage: 'kayıtsay <nick>'
}