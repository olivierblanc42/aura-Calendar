import "dotenv/config";
import { REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'aide',
        description: 'affiche la documentation',
    },
    {
        name: 'calendar',
        description: 'donne le lien du calendrier',
    },
    {
        name: 'see-event',
        description: 'voit les dernier evenement du calendrier',
    },
    {
        name: 'event',
        description: 'Ajout d\'un évènement',
        options: [
            {
                name: "store",
                description: "store name",
                type: 3,
                required: true,
                choices: [
                    { name: "Break Out", value: "Break Out" },
                    { name: "Carta'Jeu", value: "Carta'Jeu" },
                    { name: "Des Jus et des Jeux", value: "Des Jus et des Jeux" },
                    { name: "Game spirit", value: "Game spirit" },
                    { name: "La Communauté des Jeux", value: "La Communauté des Jeux" },
                    { name: "La Manufacture Des Jeux", value: "La Manufacture Des Jeux" },
                    { name: "La Parenthèse Ludique", value: "La Parenthèse Ludique" },
                    { name: "La Règle du Jeu", value: "La Règle du Jeu" },
                    { name: "La Tanière De Nemelios", value: "La Tanière De Nemelios" },
                    { name: "La Taverne du Gobelin Farci", value: "La Taverne du Gobelin Farci" },
                    { name: "Le Coin des Barons", value: "Le Coin des Barons" },
                    { name: "Le Dragon Joueur", value: "Le Dragon Joueur" },
                    { name: "Le Replay", value: "Le Replay" },
                    { name: "Le Spatioport", value: "Le Spatioport" },
                    { name: "Les 7 Royaumes", value: "Les 7 Royaumes" },
                    { name: "Lestrange market", value: "Lestrange market" },
                    { name: "PopCorp", value: "PopCorp" },
                    { name: "Trollune", value: "Trollune" },
                ]

            },
            {
                name: "event-name",
                description: "event name",
                type: 3,
                required: true
            },
            {
                name: "date",
                description: "date of the event : format DD-MM-YYYY  ",
                type: 3,
                required: true,

            },
            {
                name: "start-event",
                description: "start-event : format HH:mm",
                type: 3,
                required: true,

            },
            {
                name: "end-event",
                description: "start-event : format HH:mm",
                type: 3,
                required: true,

            }
        ]

    },

];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_SERVEUR), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}