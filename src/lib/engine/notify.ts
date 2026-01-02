// --- VTOP 2.0 COMMUNICATION GATEWAY ---

export async function sendNotification(type: 'EMAIL' | 'SMS', payload: { to: string; subject?: string; message: string }) {
    console.log(`[NOTIFY_GATEWAY] Dispatching ${type} to: ${payload.to}`);
    if (type === 'EMAIL') {
        console.log(`[NOTIFY_GATEWAY] Subject: ${payload.subject}`);
    }
    console.log(`[NOTIFY_GATEWAY] Message Payload: ${payload.message}`);
    
    // Simulating gateway latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`[NOTIFY_GATEWAY] ${type} transmitted successfully.`);
    return { success: true, messageId: `msg_${Math.random().toString(36).substring(2, 12)}` };
}

export function generateICS(events: any[]) {
    console.log("[CALENDAR_ENGINE] Constructing .ics payload...");
    
    let icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//VTOP 2.0//NONSGML v1.0//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH"
    ];

    events.forEach(event => {
        icsContent.push("BEGIN:VEVENT");
        icsContent.push(`UID:${Math.random().toString(36).substring(2)}@vtop.vit.edu`);
        icsContent.push(`DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`);
        icsContent.push(`SUMMARY:${event.title}`);
        icsContent.push(`DESCRIPTION:${event.description || 'VTOP 2.0 Academic Event'}`);
        icsContent.push(`LOCATION:${event.location || 'VIT University'}`);
        // Mocking dates if not provided
        const start = event.start || new Date().toISOString();
        const end = event.end || new Date().toISOString();
        icsContent.push(`DTSTART:${start.replace(/[-:]/g, '').split('.')[0]}Z`);
        icsContent.push(`DTEND:${end.replace(/[-:]/g, '').split('.')[0]}Z`);
        icsContent.push("END:VEVENT");
    });

    icsContent.push("END:VCALENDAR");
    
    return icsContent.join('\r\n');
}

export async function exportToGoogleCalendar(events: any[]) {
    console.log("[CALENDAR_ENGINE] Generating Google Calendar Deep Link...");
    const event = events[0];
    const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
        text: event.title,
        details: event.description || '',
        location: event.location || '',
        dates: `${event.start}/${event.end}`.replace(/[-:]/g, '').split('.')[0]
    });
    
    return `${baseUrl}&${params.toString()}`;
}
