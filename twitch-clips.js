
const config = require("./config.json");
const request = require("./await-request");

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function getSteamerClipFromTwitch(broadcaster_name) {
    // https://api.twitch.tv/helix/users
    console.log(broadcaster_name);
    let headers = { 'Client-ID': config.twitch_clientID }
    var broadcaster_id;
    const broadcaster = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/users',
        qs: { 'login': broadcaster_name },
        headers: headers,
        json: true
    });
    if (broadcaster['data'].length > 0) {
        broadcaster_id = broadcaster['data'][0].id;
    } else {
        return getRichEmbedWithText("Could not find any Twitch streamer with the name: `" + broadcaster_name + "`");
    }
    console.log(broadcaster);
    const topClips = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/clips',
        qs: { "broadcaster_id": broadcaster_id, "first": 50 },
        headers: headers,
        json: true,
    });
    const countOfClips = topClips['data'].length;
    // console.log(topClips['data'].length)
    if (countOfClips < 1) {
        return getRichEmbedWithText("No clips have been created on " + broadcaster_name + "'s stream");
    }
    const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
    console.log(topClipOfAll['thumbnail_url'])
    console.log(topClipOfAll);
    const gameDetails = await request({
        method: 'get',
        url: 'https://api.twitch.tv/helix/games',
        qs: {"id": topClipOfAll['game_id']},
        headers: headers,
        json: true
    });
    console.log(gameDetails);
    var topGameName = gameDetails['data'][0]['name'];
    const toReturn = {
        game: topGameName,
        streamer: topClipOfAll['broadcaster_name'],
        creator: topClipOfAll['creator_name'],
        url: topClipOfAll['url']
    };
    return toReturn;

    const embed = new Discord.RichEmbed()
        // .setTitle(topClipOfAll['title'])
        // .setAuthor(topClipOfAll['broadcaster_name'])
        .setColor(0x6441A5)
        // .setImage("" + topClipOfAll['thumbnail_url'])
        .setThumbnail("" + topClipOfAll['thumbnail_url'])
        .setURL(topClipOfAll['url'])
        .addField('Broadcaster', topClipOfAll['broadcaster_name'])
        .addField('Creator',topClipOfAll['creator_name']);
    // return topClipOfAll['url'];
    return embed;
    // return "Test";
}

async function getRandomClipFromTwitch() {
    let headers = { 'Client-ID': config.twitch_clientID, 'Authorization': 'Bearer ' + config.twitch_secret }

        const topGames = await request({
            method: 'get',
            url: 'https://api.twitch.tv/helix/games/top',
            params: { limit: 20 },
            headers: headers,
            json: true,
        });
        console.log("from Twitch:" ,topGames);
        const countOfGames = topGames['data'].length;
        var topGame = topGames['data'][getRandomInt(countOfGames)];
        console.log("top Game: " , topGame);
        var topGameId = topGame['id'];
        var topGameName = topGame['name'];
        console.log(topGameId);
        const topClips = await request({
            method: 'get',
            url: 'https://api.twitch.tv/helix/clips',
            qs: { "game_id": topGameId },
            headers: headers,
            json: true,
        });
        const countOfClips = topClips['data'].length;
        console.log(topClips['data'].length)
        const topClipOfAll = topClips['data'][getRandomInt(countOfClips)]
        console.log(topClipOfAll['thumbnail_url'])
        
        const toReturn = {
            game: topGameName,
            streamer: topClipOfAll['broadcaster_name'],
            creator: topClipOfAll['creator_name'],
            url: topClipOfAll['url']
        };
        return toReturn;

}

module.exports = {
    getSteamerClipFromTwitch,
    getRandomClipFromTwitch
};
