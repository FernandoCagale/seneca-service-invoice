'use strict';

const seneca = require('seneca')();
const entity = require('seneca-entity');
const mongoStore = require('seneca-mongo-store');
const invoice = require('./lib/invoice');
const dotenv = require('dotenv');
const amqp = require('seneca-amqp-transport');

dotenv.load({silent: true});

const opts = {
  mongo: {
    uri: process.env.URI || 'mongodb://127.0.0.1:27017/seneca-invoice',
    options: {}
  }
};

seneca.use(entity);
seneca.use(mongoStore, opts.mongo);
seneca.use(invoice);
seneca.use(amqp);
seneca.listen({
  pin: 'role:invoice,cmd:*',
  port: process.env.PORT || 9003
}).listen({
  type: 'amqp',
  pin: 'role:events,cmd:*',
  url: process.env.AMQP_URL || 'amqp://localhost'
});
