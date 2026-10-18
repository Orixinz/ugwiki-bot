# UGWiki Bot
This is the repository for the UGWiki Bot; a Discord/MediaWiki bot for internal use in running the Restaurant Tycoon 3 and Gym Tycoon 2 game wikis.

## Development
We're always interested in accepting contributions to the bot.

### Setting up your development environment
Prerequisites:
* Node.js and NPM
* Git
  
First, clone the repository if you have not already: `git clone https://github.com/Orixinz/ugwiki-bot`
Then, install the npm packages `npm install`.

You will need to create a `config.json` in the src directory for the code to run. The config.json should look something like this:
```json
{
    "token": <discord bot token>,
    "clientId": <discord app client id>,

    "mwuser": <mediawiki bot username>,
    "mwpswd": <mediawiki bot password>,
    "mwUserAgent": "ugwiki-bot/0.1.0 (https://rt3.ugwiki.org/wiki/User:UGWikiBot/)",

    "rt3Api": "https://rt3.ugwiki.org/w/api.php",

    "publishTrackerUniverseId": 7094518649,
    "publishTrackerWebhook": <discord webhook url>,

    "logWebhook": <discord webhook url>
}
```
