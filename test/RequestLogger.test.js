const test = require(`ava`);
const sinon = require(`sinon`);
const Datastore = require('@google-cloud/datastore');
const RequestLogger = require('../RequestLogger');

// Instantiates a client
const datastore = Datastore();
const req = {};
let datastoreInsertStub;

test.before(t => {
    req.headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0',
        'accept-language': 'en-us',
        'x-forwarded-for': '127.0.0.1'
    }
    
    datastoreInsertStub = sinon.stub(datastore, 'insert');
});

test.cb(`RequestLogger.logRequestCall: should successfully save anaytics into datastore and return 0`, t => {
    datastoreInsertStub.resolves('success');

    t.plan(1);

    RequestLogger.logRequestCall(req, 200, 'testfunction', datastore).then((result) => {
        t.is(result, 0);
        t.end();
    });
});

test.cb(`RequestLogger.logRequestCall: should throw error and return 1`, t => {
    datastoreInsertStub.rejects('failed');

    t.plan(1);

    RequestLogger.logRequestCall(req, 200, 'testfunction', datastore).then((result) => {
        t.is(result, 1);
        t.end();
    });
});