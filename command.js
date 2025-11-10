import "dotenv/config";
import { REST, Routes } from 'discord.js';

const commands = [
    {
        name: 'aide',
        description: 'affiche la documentation',
    },
    {
        name: 'calendrier',
        description: 'donne le lien du calendrier',
    },
    {
        name: 'voir-evenement',
        description: 'voit les dernier evenement du calendrier',
    },
    {
        name: 'creer-evenement',
        description: 'Ajout d\'un évènement',
        options: [
            {
                name: "magasin",
                description: "Nom du magasin",
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
                name: "type-evenement",
                description: "Type d'événement",
                type: 3,
                required: true,
                choices: [
                    { name: "TCG", value: "TCG" },
                    { name: "VGC", value: "VGC" },
                    { name: "POGO", value: "POGO" },
                ]
            },
            {
                name: "nom-evenement",
                description: "Nom de l'événement",
                type: 3,
                required: true
            },
            {
                name: "date",
                description: "Date de l'événement : format DD/MM/YYYY",
                type: 3,
                required: true,

            },
            {
                name: "debut",
                description: "Heure de début : format HH:mm",
                type: 3,
                required: true,

            },
            {
                name: "fin",
                description: "Heure de fin : format HH:mm",
                type: 3,
                required: true,

            }
        ]

    },

];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
} catch (error) {
    console.error(error);
}

