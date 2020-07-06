
const Twitter = require('twitter');
const config = require("./config.json");
const { post_log_message } = require("./discord-log");
const { getSteamerClipFromTwitch, getRandomClipFromTwitch } = require("./twitch-clips");
const CronJob = require('cron').CronJob;

var T = new Twitter({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_access_token_key,
    access_token_secret: config.twitter_access_token_secret
});

async function post_a_tweet() {
    var embed_to_send = await getRandomClipFromTwitch();
    console.log(embed_to_send);
    T.post("statuses/update", {
        status: `Checkout this Clip of \`${embed_to_send.streamer}\` playing \`${embed_to_send.game}\` \n${embed_to_send.url}`
        // attachment_url: embed_to_send.url //<== Oops, only ment for Twitter URLs
    }, function(error, tweet, response) {
        if(error) throw error;
        console.log(tweet);  // Tweet body.
        if (tweet && tweet.text) {
            post_log_message('New post', tweet.text, `https://twitter.com/ClipsKaaro/status/${tweet.id}`);
        }
        // console.log(response);  // Raw response object.
      });
      
    
}

const job = new CronJob('0 10 */4 * * *', function() {
    console.log('You will see this message every second');
    post_a_tweet();
  });

  job.start();
//   post_a_tweet();