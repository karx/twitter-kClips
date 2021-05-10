//https://birdie0.github.io/discord-webhooks-guide/structure/embed/url.html
const request = require("./await-request");


async function post_log_message(title, desc, url = "https://akriya.co.in") {
    let headers = { 'Content-Type': ' application/json' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: process.env.discord_webhook,
        body: JSON.stringify({
            "content": "twitter-kClips",
            "embeds": [{
                "title": title,
                "description": JSON.stringify(desc),
                "url": url
            }]
        }),
        headers: headers
        // json: true
    });

    console.log(msg);
    console.log('------------------');
}

module.exports = {
    post_log_message
}