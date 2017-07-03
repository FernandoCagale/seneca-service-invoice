const Lab = require('lab');
const Code = require('code');
const Seneca = require('seneca');
const entity = require('seneca-entity');
const mongoStore = require('seneca-mongo-store');

const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const expect = Code.expect;
const ROLE = 'invoice';

const opts = {
  mongo: {
    uri: process.env.URI || 'mongodb://127.0.0.1:27017/seneca-invoice-test',
    options: {}
  }
};

function testSeneca (fin) {
  return Seneca({log: 'test'})
    .use(entity)
    .use(mongoStore, opts.mongo)
    .test(fin)
    .use(require('../lib/invoice'));
}

describe('test invoice', () => {
  let _id;

  it('create', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'create',
      emission: '01/06/2017',
      price: 25.00,
      orderId: '595a66789f14e52b68b28d3d',
      client: 'Client test'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.invoice.emission).to.equal('01/06/2017');
      expect(result.invoice.price).to.equal(25.00);
      expect(result.invoice.client).to.equal('Client test');
      expect(result.invoice.orderId).to.equal('595a66789f14e52b68b28d3d');
      expect(result.invoice.id).to.exist();
      expect(result.ok).to.equal(true);
      _id = result.invoice.id;
    })
    .ready(fin);
  });

  it('findAll', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'findAll'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.invoices).to.exist();
    })
    .ready(fin);
  });

  it('findById', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'findById',
      id: _id
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.invoice.emission).to.equal('01/06/2017');
      expect(result.invoice.price).to.equal(25.00);
      expect(result.invoice.client).to.equal('Client test');
      expect(result.invoice.orderId).to.equal('595a66789f14e52b68b28d3d');
      expect(result.invoice.id).to.exist();
      expect(result.ok).to.equal(true);
    })
    .ready(fin);
  });

  it('update', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'create',
      id: _id,
      emission: '06/06/2017',
      price: 50.00,
      orderId: '595a66789f14e52b68b28d3a',
      client: 'Client test - alter'
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.invoice.emission).to.equal('06/06/2017');
      expect(result.invoice.price).to.equal(50.00);
      expect(result.invoice.client).to.equal('Client test - alter');
      expect(result.invoice.orderId).to.equal('595a66789f14e52b68b28d3a');
      expect(result.invoice.id).to.exist();
      expect(result.ok).to.equal(true);
    })
    .ready(fin);
  });

  it('remove', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'remove',
      id: _id
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.ok).to.equal(true);
    })
    .ready(fin);
  });

  it('findById not found', (fin) => {
    const seneca = testSeneca(fin);

    const pattern = {
      role: ROLE,
      cmd: 'findById',
      id: _id
    };

    seneca
    .gate()
    .act(pattern, (ignore, result) => {
      expect(result.ok).to.equal(false);
      expect(result.why).to.equal('ID not found');
    })
    .ready(fin);
  });
});

