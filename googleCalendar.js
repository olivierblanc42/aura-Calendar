import { google } from "googleapis";
import "dotenv/config";


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

    // const events = res.data.items || [];
    // return events.map(ev => `${ev.start?.dateTime || ev.start?.date} - ${ev.summary}`);
    const event = res.data.items;
    return console.log(event)
}



export async function addEvents(boutique ,evenement,start,end) {
    let summary = boutique +": " + evenement ;
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
