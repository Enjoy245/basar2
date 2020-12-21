const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
const { Client, Util } = require("discord.js");
const fs = require("fs");
const http = require("http");
const express = require("express");
require("./util/eventLoader.js")(client);
const path = require("path");
const request = require("request");
const queue = new Map();

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + "Bot Hostlandı!");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

//KAYIT MESAJ
//NOT Kendi isteğinize göre burada ki yazıları değiştirin!
client.on("guildMemberAdd", (member, message) => {
  const sunucuid = "SUNUCUNUN İDSİ"; //Sunucu id
  const id = "HOŞGELDİN MESAJI KANAL İD"; //Kanal id
  const jail =
    "3 AYDAN ÖNCE AÇILAN HESAPLARA VERİLEN ROL | GÜVENLİK İÇİN İSTEMİYORSANIZ SİLİN"; //jail rol id
  const kayıtsız = "YENİ GELENLERE VERİLECEK ROL"; //Kayıtsız rol id
  let resim = "";
  if (member.guild.id !== sunucuid) return;
  let aylartoplam = {
    "01": "Ocak",
    "02": "Şubat",
    "03": "Mart",
    "04": "Nisan",
    "05": "Mayıs",
    "06": "Haziran",
    "07": "Temmuz",
    "08": "Ağustos",
    "09": "Eylül",
    "10": "Ekim",
    "11": "Kasım",
    "12": "Aralık"
  };
  let aylar = aylartoplam;
  let user = client.users.cache.get(member.id);
  require("moment-duration-format");
  let eskiNick = member.user.username;
  const channel = member.guild.channels.cache.get(id);
  const kurulus = new Date().getTime() - user.createdAt.getTime();
  const gün = moment.duration(kurulus).format("D");
  var kontrol;
  if (gün < 14) {
    kontrol = "Güvenilmeyen Kullanıcı!";
    member.roles.add(jail);
  }
  if (gün > 14) {
    kontrol = "Güvenilir Kullanıcı!";
    member.roles.add(kayıtsız);
  }

  let codearius = new Discord.MessageEmbed()
    .setAuthor(`Yeni birisi spawn oldu!`)
    .setDescription(
      `**Hoşgeldin!** ${member}

seninle beraber **${member.guild.members.cache.size}** kişiyiz!

Kayıt olmak için <@&KAYITCI ROL İD> rolündeki yetkilileri etiketlemeyi unutma.`
    )
    .addField(
      "Hesap Oluşturma Tarihi",
      `\`${moment(user.createdAt).format("DD")} ${
        aylar[moment(user.createdAt).format("MM")]
      } ${moment(user.createdAt).format("YYYY")}\``,
      true
    )
    .addField("Bu Hesap", `\`${kontrol}\``, true)
    .setThumbnail(resim)
    .setColor("BLUE")
    .setTimestamp();
  channel.send(codearius);
});

client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username !== newUser.username) {
    const tag = "TAGINIZ";
    const sunucu = "SUNUCU ID";
    const kanal = "KANAL ID";
    const rol = "ROL ID";

    try {
      if (
        newUser.username.includes(tag) &&
        !client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rol)
      ) {
        await client.channels.cache
          .get(kanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("GREEN")
              .setDescription(
                `${newUser} ${tag} Tagımızı Aldığı İçin <@&${rol}> Rolünü Verdim`
              )
          );
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.add(rol);
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .send(
            `Selam ${
              newUser.username
            }, Sunucumuzda ${tag} Tagımızı Aldığın İçin ${
              client.guilds.cache.get(sunucu).roles.cache.get(rol).name
            } Rolünü Sana Verdim!`
          );
      }
      if (
        !newUser.username.includes(tag) &&
        client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.cache.has(rol)
      ) {
        await client.channels.cache
          .get(kanal)
          .send(
            new Discord.MessageEmbed()
              .setColor("RED")
              .setDescription(
                `${newUser} ${tag} Tagımızı Çıkardığı İçin <@&${rol}> Rolünü Aldım`
              )
          );
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .roles.remove(rol);
        await client.guilds.cache
          .get(sunucu)
          .members.cache.get(newUser.id)
          .send(
            `Selam **${
              newUser.username
            }**, Sunucumuzda ${tag} Tagımızı Çıkardığın İçin ${
              client.guilds.cache.get(sunucu).roles.cache.get(rol).name
            } Rolünü Senden Aldım!`
          );
      }
    } catch (e) {
      console.log(`Bir hata oluştu! ${e}`);
    }
  }
});

//codearius- alien.xxl

/////////// -- - - - -- - - -OTO CEVAP - - - -- - - - \\\\\\\\\\\\

client.on("message", msg => {
  if (msg.content.toLowerCase() === "sa") {
    // İstediğiniz Komut
    msg.reply("aleyküm selam hoş geldin."); //Komutu Yazınca cevap ne yazsın?
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "hakya") {
    // İstediğiniz Komut
    msg.reply("efendim"); //Komutu Yazınca cevap ne yazsın?
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "yapız") {
    // İstediğiniz Komut
    msg.reply("o biraz meşgul onay almayı bekliyor "); //Komutu Yazınca cevap ne yazsın?
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "øχψĝεπ") {
    // İstediğiniz Komut
    msg.reply("o biraz meşgul top.gg den yapız'la onaylanmaya çalışıyorlar"); //Komutu Yazınca cevap ne yazsın?
  }
});
client.on("message", msg => {
  if (msg.content.toLowerCase() === "sen onaylanmak istemiyormusun") {
    // İstediğiniz Komut
    msg.reply("ben sadece bu sunucudakiler için çalışıcama yemin ettim"); //Komutu Yazınca cevap ne yazsın?
  }
});





//

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});
client.login(ayarlar.token);
