// ==============================
// Bot initialization
// ==============================

// Module imports (discord.js, moment, dotenv, Google Calendar)
import {
    Client, GatewayIntentBits, Partials, Events, Guild, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, EmbedBuilder,
    roleMention
} from "discord.js";
import { Documentation } from "./documentation.js";
import moment from "moment";
import "moment/locale/fr.js";
import "dotenv/config";
import { listEvents, addEvents } from './googleCalendar.js';
import { content } from "googleapis/build/src/apis/content/index.js";
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Bot Aura Calendar is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`✅ Web server started on port ${PORT}`);
});
moment.locale("fr");


const documentation = Documentation;


// ==============================
// Create a client instance
// ==============================
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
});

// ==============================
// When the bot is ready
// ==============================
client.on(Events.ClientReady, readyClient => {
    console.log(`Logged in as ${readyClient.user.tag}!`);
    // console.log(readyClient.user.id)
    // console.log(documentation);
});





client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const channel = await interaction.client.channels.fetch('1419578434543288320');



    // ==============================
    // Command 'aide'
    // ==============================

    // When the user runs /aide
    if (interaction.commandName === 'aide') {
        // Build the command list and descriptions from the documentation file
        let finalString = "";
        if (documentation.entries.length > 0) {
            const entriesText = documentation.entries;

            entriesText.forEach(element => {
                finalString += element.command + ": " + element.description + "\n"

            });
        }
        // Send documentation to the channel
        await interaction.reply("Documentation Bot Aura Calendar :" + "\n" + finalString);

    }

    // ==============================
    // COMMAND 'calendar'
    // ==============================

    // Creating a button to open Google Calendar
    const calendar = new ButtonBuilder()
        .setLabel('Callendrier')
        .setURL('https://calendar.google.com/calendar/u/0?cid=ZTExODMyYzUwM2Q3ZjgyZDYwZGQxZTViYjIzNGFlOTJlNmE5NjAxNjBhM2Q1MDg3NGQzZTkyZjU5YjJmYzdkM0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t')
        .setStyle(ButtonStyle.Link)
    const row = new ActionRowBuilder()
        .addComponents(calendar);
    if (interaction.commandName === "calendar") {
        // Send button to the channel




        await interaction.reply({
            content: 'Cliquez ici pour voir le calendrier',
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }

    // ==============================
    // Command 'event'
    // ==============================

    //Check if the user has the required roles
    const member = interaction.member.roles.cache;
    const userName = member.map((role) => role.name);
    const modo = (element) => element === "Moderateur"
    const boutique = (element) => element === "Gérant boutique"
    // let rolePing = '1422877250247721063'

    if (userName.some(modo) || userName.some(boutique)) {
        if (interaction.commandName === 'event') {
            // Get the options from the command
            let eventName = interaction.options.getString("event-name");
            let storeName = interaction.options.getString("store");
            let typeEvent = interaction.options.getString("type-name");
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
            let sendTypeEvent = 'Non précisée';


            // swap slashes for dashes
            dateEvent = dateEvent.replace(/\//g, '-');



            // Validation of dates and times with moment.js

            // Event date validation
            if (dateEvent) {
                const m = moment(dateEvent, "DD-MM-YYYY", true);

                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format DD-MM-YYYY");
                    return;
                }

                dateMoment = m.format('LL')

                dateDay = m.format("YYYY-MM-DD")
            }

            // Start event validation
            if (startEvent) {
                const m = moment(startEvent, "HH:mm", true);

                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format HH:mm");
                    return;
                }

                startHour = m.format("HH:mm");
            }


            // End event validation
            if (endEvent) {

                const m = moment(endEvent, "HH:mm", true);

                if (!m.isValid()) {
                    await interaction.reply("❌ Date invalide ! Utilise le format HH:mm");
                    return;
                }

                hourEnd = m.format("HH:mm");
            }


            dateSend = dateDay + 'T' + startHour + ":00"
            dateEnd = dateDay + 'T' + hourEnd + ":00"


            let start = moment(dateSend, moment.ISO_8601, true)
            let end = moment(dateEnd, moment.ISO_8601, true)

            // Check that the event does not end before it starts
            if (start > end) {
                await interaction.reply("❌ le debut de l'evenement ne peux pas etre après la fin");
                return;
            }

            //Create the embed for the event message
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


            //Add event in Google Calendar
            await addEvents(storeName, eventName, dateSend, dateEnd)


            //Send reply for event creation

            // 
            //     await interaction.reply({
            //         content: " <@&" + rolePing + ">", embeds: [messageEmbed], allowedMentions: { parse: [], roles: [rolePing], repliedUser: true }
            //     });

            // }
            await interaction.reply({
                embeds: [messageEmbed], allowedMentions: { parse: [], roles: [], repliedUser: true }
            });

        }
    } else {
        //Send reply if the user doesn't have the required roles

        await interaction.reply(
            {
                content: '❌ Vous n\'êtes pas autorisé à utiliser cette commande, vous ne possédez pas les rôles requis.',
                flags: 64

            }
        );

    }

    // ==============================
    // Command 'see-event'
    // ==============================

    if (interaction.commandName === 'see-event') {
        try {
            // Retrieve events from Google Calendar
            const events = await listEvents();
            const allEvents = events.join("\n")


            if (events.length > 0) {
                //Create different embeds depending on whether there is one or multiple events

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
                    // Send the embed message if there is one event
                    await interaction.reply({
                        embeds: [oneEvent], flags: 64
                    });


                } else {
                    // Send the embed message if there are two or more events
                    await interaction.reply({
                        embeds: [manyEvent], flags: 64

                    });
                }

            } else {
                // Send the embed message for 0 event
                await interaction.reply({
                    content: 'Il n\'y a pas d\'événement pour le moment.', flags: 64

                });
            }



        } catch (error) {
            console.error('Erreur lors de la récupération des événements :', error);
        }



    }

})



// ==============================
// connect the bot 
// ==============================
client.login(process.env.DISCORD_TOKEN);