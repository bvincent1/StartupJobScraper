'use strict';

const request = require('request');
const cheerio = require('cheerio');
const PushBullet = require('pushbullet');


module.exports.cron = (err, context, callback) => {
  const options = {
    url: 'https://www.startupedmonton.com/jobs/',
    headers: {
      'User-Agent': 'StartupJobScraper'
    }
  };

  function main (err, resp, body) {
    if (err) {
      callback(true, err);
    }
    else {
      const $ = cheerio.load(body);
      const pusher = new PushBullet(process.env.PUSHBULLET_API_KEY);
      var titles = [];
      var links = [];

      $('.sqs-block-content h3').each((i, val) => {
         titles.push($(val).text());
      });

      $('a.sqs-block-button-element').each((i, val) => {
        links.push($(val).attr('href'));
      });

      pusher.link('benjc.vincent@gmail.com', titles[0], links[0], (err, resp) => {
        console.log(err);
        console.log(resp);
      });

      callback(null, {'message': resp && resp.statusCode});
    }
  }

  request(options, main);
};
