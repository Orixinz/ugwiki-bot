// MediaWiki login feature
const ROOT_WIKI_API_URL = "ugwiki.org/w/api.php/";
export type Wiki = "rt3" | "gt2";

export function getWikiUrl(wiki: Wiki): string {
    return `https://${wiki}.${ROOT_WIKI_API_URL}`;
}

export async function request(wiki: Wiki, params: object, method: string, body?: JSON): Promise<any> {
    var paramsString = "?format=json&";

    for (const [key, value] of Object.entries(params)) {
        paramsString += `${key}=${value}&`;
    }
    
    const url = getWikiUrl(wiki) + paramsString;

    var options: { method: string, body?: string } = {
        method: method,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.log('[!] [MediaWiki]: Request Error - ' + error.message)
    }

    return undefined;
}
    

export async function login(wiki: Wiki, username: string, password: string) {
    try {
        const loginToken = await request(wiki, {
            action: 'query',
            meta: 'tokens',
            type: 'login',
            format: 'json'
        }, "GET").query?.tokens?.logintoken;

        await request(wiki, {
            action: 'login',
            lgname: username,
            lgpassword: password,
            lgtoken: loginToken,
            format: 'json'
        }, "POST");
        console.log('[MediaWiki]: Sucessfully logged in as ' + username)
    } catch (error) {
        console.log('[!] [MediaWiki]: Login Error - ' + error.message)
    }
}