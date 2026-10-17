// UGWiki MediaWiki API Wrapper
// Original author: Orixinz
const ROOT_WIKI_API_URL = "miraheze.org/w/api.php/";
export type Wiki = "rt3" | "gymisland";

export function mwGetWikiUrl(wiki: Wiki): string {
    return `https://${wiki}.${ROOT_WIKI_API_URL}`;
};

async function internal_request(wiki: Wiki, sessionCookie: string, params: object, method: string, body?: object): Promise<Response | undefined> {
    var paramsString = "?format=json&";

    for (const [key, value] of Object.entries(params)) {
        paramsString += `${key}=${value}&`;
    }
    
    const url = mwGetWikiUrl(wiki) + paramsString;

    var options: { method: string, body?: string, headers?: object } = {
        method: method,
    };

    if (sessionCookie !== "") {
        options.headers = {
            Cookie: `${wiki}wikiSession=${sessionCookie}`,
            'user-agent': 'ugwiki-bot/1.0 (https://rt3.ugwiki.org/wiki/User:UGWikiBot; orixinz227@gmail.com)'
        }
    } else {
        options.headers = {
            'user-agent': 'ugwiki-bot/1.0 (https://rt3.ugwiki.org/wiki/User:UGWikiBot; orixinz227@gmail.com)'
        }
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    console.log(options)

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.log('[!] [MediaWiki]: Request Error - ' + error.message)
    }

    return undefined;
};

async function login(wiki: Wiki, username: string, password: string): Promise<string | undefined> {
    console.log('[MediaWiki]: Logging in as ' + username + ' on wiki ' + wiki)
    try {
        const loginTokenResponse = await internal_request(wiki, "", {
            action: 'query',
            meta: 'tokens',
            type: 'login',
            format: 'json'
        }, "GET");

        if (!loginTokenResponse) {
            return;
        }

        const loginTokenJson = await loginTokenResponse.json()
        const loginToken = await loginTokenJson.query?.tokens?.logintoken;

        const response = await internal_request(wiki, "", {
            action: 'login',
            lgname: username,
            format: 'json'
        }, "POST", {
            lgpassword: password,
            lgtoken: loginToken
        });

        if (!response) {
            return;
        }

        console.log(await response.json())

        const session = response.headers.getSetCookie()
        .find(c => c.startsWith(`${wiki}wikiSession=`))
        ?.split(';')[0];

        console.log(`[MediaWiki]: Successfully logged in as ${username}.`);

        return session;
    } catch (error) {
        console.log('[!] [MediaWiki]: Login Error - ' + error.message);
    }
};

export class MWClient {
    username: string;
    password: string;
    wiki: Wiki;
    cookie: string = "";

    constructor(wiki: Wiki, username: string, password: string) {
        this.username = username;
        this.password = password;
        this.wiki = wiki;
    };

    async login() {
        const result = await login(this.wiki, this.username, this.password);
        if (result) {
            this.cookie = result;
        }
    }

    async request(params: object, method: string, body?: JSON): Promise<any> {
        // login check
        const response = await internal_request(this.wiki, this.cookie, {
            action: "query",
            meta: "userinfo",
            uiprop: "realname",
            format: "json"
        }, "GET");

        if (!response) {
            console.log("[!] [MediaWiki Request]: Got no response on userinfo check.");
            return;
        }

        const responseJson = await response.json()
        const isLoggedIn = responseJson.query?.userinfo?.id !== 0;

        if (!isLoggedIn) {
            console.log("[MediaWiki]: Account was logged out, logging back in.");
            const result = await login(this.wiki, this.username, this.password);
            if (result) {
                this.cookie = result;
            }
        }

        const result = await internal_request(this.wiki, this.cookie, params, method, body);
        if (!result) {
            console.log("[!] [MediaWiki Request]: Got no result on request.");
            return;
        }
        const resultJson = await result.json()
        return resultJson;
    }
}