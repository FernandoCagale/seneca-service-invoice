'use strict';

const amqp = require('amqplib/callback_api');
const URL = process.env.AMQP_URL || 'amqp://localhost';

module.exports = {
  channel: createQueueChannel,
  encode: encode,
  decode: decode
};

function createQueueChannel (queue, cb) {
  amqp.connect(URL, onceConnected);

  function onceConnected (err, conn) {
    if (err) throw err;
    conn.createChannel(onceChannelCreated);

    function onceChannelCreated (err, channel) {
      if (err) return cb(err);
      return channel.assertQueue(queue, {durable: false}, onceQueueCreated);

      function onceQueueCreated (err) {
        if (err) return cb(err);
        return cb(null, channel, conn);
      }
    }
  }
}

function encode (doc) {
  return Buffer.from(JSON.stringify(doc));
}

function decode (doc) {
  return JSON.parse(doc);
}
