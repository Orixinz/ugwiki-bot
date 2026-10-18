import config from './config.json' with { type: "json" };

async function sendInfoEmbed(...messages: string[]) {
    try {
        const response = await fetch(config.logWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "content": messages.join(" ")
            })
        })

        if (!response.ok) {
            console.log("[LOG INTERNAL]: Failed to send embed.")
        }
    } catch (error) {
        console.log("[LOG INTERNAL]: Failed to send embed.")
    }
}

async function sendWarnEmbed(...messages: string[]) {
    try {
        const response = await fetch(config.logWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               "content": "⚠️ **" + messages.join(" ") + "**"
            })
        })

        if (!response.ok) {
            console.log("[LOG INTERNAL]: Failed to send embed.")
        }
    } catch (error) {
        console.log("[LOG INTERNAL]: Failed to send embed.")
    }
}

async function sendMinorEmbed(...messages: string[]) {
    try {
        const response = await fetch(config.logWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               "content": "-# " + messages.join(" ")
            })
        })

        if (!response.ok) {
            console.log("[LOG INTERNAL]: Failed to send embed.")
        }
    } catch (error) {
        console.log("[LOG INTERNAL]: Failed to send embed.")
    }
}

export function info(...messages: string[]) {
    console.log(...messages);
    sendInfoEmbed(...messages);
}

export function warn(...messages: string[]) {
    console.log("[!]", ...messages);
    sendWarnEmbed(...messages);
}

export function minor(...messages: string[]) {
    // minor only gets sent into discord
    sendMinorEmbed(...messages);
}
