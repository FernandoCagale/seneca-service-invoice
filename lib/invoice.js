'use strict';

const amqp = require('./amqp');

module.exports = function invoice (options) {
  const seneca = this;
  const invoice = seneca.make('invoice');
  const ROLE = 'invoice';

  consumeQueueCreate();

  seneca.add({role: ROLE, cmd: 'findAll'}, findAll);
  seneca.add({role: ROLE, cmd: 'findById'}, findById);
  seneca.add({role: ROLE, cmd: 'create'}, create);
  seneca.add({role: ROLE, cmd: 'update'}, update);
  seneca.add({role: ROLE, cmd: 'remove'}, remove);

  function findAll (args, done) {
    return invoice.list$({}, (err, invoices) => {
      if (err) return done(err);
      return done(null, {invoices: invoices});
    });
  }

  function findById (args, done) {
    return invoice.load$({id: args.id}, (err, invoice) => {
      if (err) return done(err);
      if (!invoice) return done(null, {ok: false, why: 'ID not found'});
      return done(null, {ok: true, invoice: seneca.util.clean(invoice)});
    });
  }

  function create (args, done) {
    const invoice = seneca.make$('invoice');
    invoice.emission = args.emission;
    invoice.price = args.price;
    invoice.client = args.client;
    invoice.orderId = args.orderId;

    return invoice.save$((err, value) => {
      if (err) return done(err);
      return done(null, {ok: true, invoice: seneca.util.clean(value)});
    });
  }

  function update (args, done) {
    return invoice.load$({id: args.id}, (err, invoice) => {
      if (err) return done(err);
      if (!invoice) return done(null, {ok: false, why: 'ID not found'});

      invoice.emission = args.emission;
      invoice.price = args.price;
      invoice.client = args.client;
      invoice.orderId = args.orderId;
      return invoice.save$((err, invoice) => {
        if (err) return done(err);
        return done(null, {ok: true, invoice: seneca.util.clean(invoice)});
      });
    });
  }

  function remove (args, done) {
    const id = args.id;
    return invoice.load$({id: id}, (err, invoice) => {
      if (err) return done(err);
      if (!invoice) return done(null, {ok: false, why: 'ID not found'});

      return invoice.remove$({id: id}, (err, invoice) => {
        if (err) return done(err);
        return done(null, {ok: true});
      });
    });
  }

  function consumeQueueCreate (order) {
    const QUEUE = 'create_invoice';
    amqp.channel(QUEUE, (err, channel, conn) => {
      if (err) throw err;
      channel.consume(QUEUE, (msg) => {
        const order = amqp.decode(msg.content);
        const invoice = seneca.make$('invoice');
        invoice.emission = order.emission;
        invoice.price = order.price;
        invoice.client = order.client;
        invoice.orderId = order.id;
        invoice.save$((err, invoice) => {
          if (err) throw err;
        });
      }, { noAck: true });
    });
  }
};
