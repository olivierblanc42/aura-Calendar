import { google } from "googleapis";
import "dotenv/config";
import "moment/locale/fr.js";
import moment from "moment";

// Fetches the next 20 events from Google Calendar and returns them as formatted strings
export async function listEvents() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: 'service_account',
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL
        },
        scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const res = await calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        timeMin: new Date().toISOString(),
        maxResults: 20,
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = res.data.items || [];
    


 const   eventsList =  events.map(
        
     ev => `${ev.summary}, le ${moment(ev.start?.dateTime).format('LLL')} `

    );
     
    return eventsList;
}


// Adds a new event to Google Calendar with the given shop, title, start, and end time

export async function addEvents(boutique, evenement, start, end, game) {
    let summary = boutique + " : " + game +" " + evenement ;
    const auth = new google.auth.GoogleAuth({
        credentials: {
            type: 'service_account',
            project_id: process.env.GOOGLE_PROJECT_ID,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            client_email: process.env.GOOGLE_CLIENT_EMAIL
        },
        scopes: ['https://www.googleapis.com/auth/calendar.events']
    });
    const calendar = google.calendar({ version: 'v3', auth });
    const rest = await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: {
            summary: summary, 
            start: {
                dateTime: start,
                timeZone: "CET"
            },
            end: {
                dateTime: end,
                timeZone: "CET"

            },
            description: evenement,
 
        }
        
    
    })

    return   rest;
    
}
