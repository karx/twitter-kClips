const request = require("./await-request");
const config = require("./config.json");

async function post_log_message(title, desc, url = "https://akriya.co.in") {
    let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    console.log('------------------');
    var msg = await request({
        method: 'post',
        url: config.discord_webhook,
        form : JSON.stringify({ 
            "content" : "twitter-kClips", 
            "embeds" : [{
                "title" : title,
                "description" : JSON.stringify(desc),
                "url": url
            }]
        }),
        headers: headers
        // json: true
    });
    //https://birdie0.github.io/discord-webhooks-guide/structure/embed/url.html
    console.log(msg);
    console.log('------------------');
}

module.exports = {
    post_log_message
}