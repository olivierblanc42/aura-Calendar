
import {
    Client, GatewayIntentBits, Partials, Events, Guild, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, EmbedBuilder
} from "discord.js";
import { Documentation } from "./documentation.js";
import moment from "moment";
import "moment/locale/fr.js";
import "dotenv/config";
import { listEvents, addEvents } from './googleCalendar.js';
import { content } from "googleapis/build/src/apis/content/index.js";

moment.locale("fr");


const documentation = Documentation;



//On crée une instance du client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,        // Nous autorise à accéder au serveur
        GatewayIntentBits.GuildMessages,  // Nous autorise à accéder au message
        GatewayIntentBits.MessageContent,   // Nous autorise à accéder au contenu du message
        GatewayIntentBits.GuildMessageReactions  // Nous autorise à accéder aux réactions du contenu
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
});


//On agit quand le bot est prêt.

client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
    // console.log(readyClient.user.id)
    // console.log(documentation);
});



// Le bot repond a des messages 

// Affiche la documentation
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'aide') {
        let finalString = "";
        if (documentation.entries.length > 0) {
            const entriesText = documentation.entries;
            entriesText.forEach(element => {
                finalString += element.command + ": " + element.description + "\n"

            });
        }
        await interaction.reply("Documentation Bot Aura Calendar :" + "\n" + finalString);

    }

})

//Affiche le lien du calendrier

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const calendar = new ButtonBuilder()
        .setLabel('Callendrier')
        .setURL('https://calendar.google.com/calendar/u/0?cid=ZTExODMyYzUwM2Q3ZjgyZDYwZGQxZTViYjIzNGFlOTJlNmE5NjAxNjBhM2Q1MDg3NGQzZTkyZjU5YjJmYzdkM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t')
        .setStyle(ButtonStyle.Link)
    const row = new ActionRowBuilder()
        .addComponents(calendar);
    if (interaction.commandName === "calendar") {
        await interaction.reply({
            content: 'Cliquez ici pour voir le calendrier',
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }

})


// Ajoute un événement dans le calendrier en cours de développement

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.member.roles.cache;
    let userName = member.map((role) => role.name);
    const modo = (element) => element === "Moderateur"
    const boutique = (element) => element === "Gérant boutique"




    if (userName.some(modo) || userName.some(boutique)) {
        if (interaction.commandName === 'event') {
            let eventName = interaction.options.getString("event-name");
            let storeName = interaction.options.getString("store");
            let dateEvent = interaction.options.getString("date");
            let startEvent = interaction.options.getString("start-event")
            let endEvent = interaction.options.getString("end-event")
            let dateMoment = 'Non précisée';
            let dateDay = 'Non précisée';
            let startHour = 'Non précisée';
            let hourEnd = 'Non précisée';
            let dateEnd = 'Non précisée';
            let dateSend = 'Non précisée';
            let iconUSer = interaction.user.avatarURL()


            if (dateEvent) {
                const m = moment(dateEvent, "DD-MM-YYYY", true);

                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format DD-MM-YYYY");
                    return;
                }
                dateMoment = m.format('LL')
                dateDay = m.format("YYYY-MM-DD")
            }


            if (startEvent) {
                const m = moment(startEvent, "HH:mm", true);
                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format HH:mm");
                    return;
                }
                startHour = m.format("HH:mm");
            }
            dateSend = dateDay + 'T' + startHour + ":00"

            if (endEvent) {
                const m = moment(endEvent, "HH:mm", true);
                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format HH:mm");
                    return;
                }
                hourEnd = m.format("HH:mm");
            }

            dateEnd = dateDay + 'T' + hourEnd + ":00"

            let start = moment(dateSend, moment.ISO_8601, true)
            let end = moment(dateEnd, moment.ISO_8601, true)


            if (start > end) {
                await interaction.reply("❌ le debut de l'evenement ne peux pas etre après la fin");
                return;
            }


            const message = `📅 Nouvel événement ajouté : 
        - Magasin : ${storeName}
        - Événement : ${eventName}
        - Date : ${dateMoment}
        `
            const messageEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('📅 Nouvel événement ajouté : ' + eventName)
                .setURL('https://calendar.google.com/calendar/u/0?cid=ZTExODMyYzUwM2Q3ZjgyZDYwZGQxZTViYjIzNGFlOTJlNmE5NjAxNjBhM2Q1MDg3NGQzZTkyZjU5YjJmYzdkM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t')
                .setAuthor({ name: storeName, iconURL: iconUSer })
                .setDescription(eventName + " par " + storeName + " le " + dateMoment)
                .addFields(
                    { name: 'Debut : ', value: startHour, inline: true },
                    { name: 'Fin : ', value: hourEnd, inline: true },
                )
                .setTimestamp()



            // await addEvents(storeName, eventName, dateSend, dateEnd)


            await interaction.reply({ embeds: [messageEmbed] });

        }
    } else{
        await interaction.reply(
            {
                content: '❌ Vous n\'êtes pas autorisé à utiliser cette commande, vous ne possédez pas les rôles requis.',
                flags: 64  

            }
        );

    }


   
});

//Affiche les 20 derniers événements

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;



    if (interaction.commandName === 'see-event') {


        try {
            const events = await listEvents();
            const allEvents = events.join("\n")
            console.log(events.length)


            if (events.length > 0) {

                const manyEvent = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('📅 Liste des événements')
                    .setURL('https://calendar.google.com/calendar/u/0?cid=ZTExODMyYzUwM2Q3ZjgyZDYwZGQxZTViYjIzNGFlOTJlNmE5NjAxNjBhM2Q1MDg3NGQzZTkyZjU5YjJmYzdkM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t')
                    .setDescription(allEvents)
                    .setTimestamp()

                const oneEvent = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('📅 Événement à venir')
                    .setURL('https://calendar.google.com/calendar/u/0?cid=ZTExODMyYzUwM2Q3ZjgyZDYwZGQxZTViYjIzNGFlOTJlNmE5NjAxNjBhM2Q1MDg3NGQzZTkyZjU5YjJmYzdkM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t')
                    .setDescription(allEvents)
                    .setTimestamp()

                if (events.length === 1) {

                    await interaction.reply({ embeds: [oneEvent], flags: 64 
    
                     });


                } else {
                    await interaction.reply({ embeds: [manyEvent], flags: 64 
    
                     });
                }

            } else {
                await interaction.reply({ content: 'Il n\'y a pas d\'événement pour le moment.', flags: 64 

                 });
            }



        } catch (error) {
            console.error('Erreur lors de la récupération des événements :', error);

        }



    }
});


//On connecte le bot
client.login(process.env.DISCORD_TOKEN);