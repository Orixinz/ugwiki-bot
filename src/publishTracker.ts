// we use a webhook here so its independent from the bot.
import config from './config.json' with { type: "json" };
import { info, warn } from './log.ts';

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function getExperienceInfo(id: number) {
    const url = `https://games.roblox.com/v1/games?universeIds=${id}`;
    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const json = await response.json();
    return json.data[0];
}

async function sendUpdateEmbed(hookUrl: string) {
    const response = await fetch(hookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "embeds": [{
                "title": "Game Published",
                "description": "Restaurant Tycoon 3 has been published to within the past minute."
            }],
        })
    })

    if (!response.ok) {
        warn("[publishTracker]: Failed to send embed.")
    }
}

export async function startTracking() {
    var lastUpdated = "never";
    while (true) {
        info("[publishTracker]: Checking for updates. Last Updated Time:", lastUpdated)
        const experienceInfo = await getExperienceInfo(config.publishTrackerUniverseId)
        if (lastUpdated == "never") {
            lastUpdated = experienceInfo.updated
        } else if (experienceInfo?.updated !== lastUpdated) {
            info("[publishTracker]: Update detected.")
            sendUpdateEmbed(config.publishTrackerWebhook)
            lastUpdated = experienceInfo.updated
        }
        await sleep(60);
    }
}