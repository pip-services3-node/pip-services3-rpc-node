let assert = require('chai').assert;
let restify = require('restify-clients');
let async = require('async');
let fs = require('fs');

import { Descriptor, IdGenerator } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { Dummy } from '../Dummy';
import { DummyController } from '../DummyController';
import { DummyRestService } from './DummyRestService';

var restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000,
    "openapi_content", "swagger yaml or json content",  // for test only
    "swagger.enable", "true"
);

suite('DummyRestService', ()=> {
    var _dummy1: Dummy;
    var _dummy2: Dummy;

    let service: DummyRestService;

    let rest: any;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        service = new DummyRestService();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'rest', 'default', '1.0'), service
        );
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });

        _dummy1 = { id: null, key: "Key 1", content: "Content 1"};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2"};
    });

    test('CRUD Operations', (done) => {
        var dummy1, dummy2;

        async.series([
        // Create one dummy
            (callback) => {
                rest.post('/dummies',
                    _dummy1,
                    (err, req, res, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy1.content);
                        assert.equal(dummy.key, _dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Create another dummy
            (callback) => {
                rest.post('/dummies', 
                    _dummy2,
                    (err, req, res, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, _dummy2.content);
                        assert.equal(dummy.key, _dummy2.key);

                        dummy2 = dummy;

                        callback();
                    }
                );
            },
        // Get all dummies
            (callback) => {
                rest.get('/dummies',
                    (err, req, res, dummies) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummies);
                        assert.lengthOf(dummies.data, 2);

                        callback();
                    }
                );
            },
        // Update the dummy
            (callback) => {
                dummy1.content = 'Updated Content 1';
                rest.put('/dummies',
                    dummy1,
                    (err, req, res, dummy) => {
                        assert.isNull(err);
                        
                        assert.isObject(dummy);
                        assert.equal(dummy.content, 'Updated Content 1');
                        assert.equal(dummy.key, _dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
        // Delete dummy
            (callback) => {
                rest.del('/dummies/' + dummy1.id,
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete dummy
            (callback) => {
                rest.get('/dummies/' + dummy1.id,
                    (err, req, res, dummy) => {
                        assert.isNull(err);
                        
                        // assert.isObject(dummy);

                        callback();
                    }
                );
            }
        ], done);
    });

    test('Get OpenApi Spec From String', (done) => {
        var client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });

        async.series([
            (callback) => {
                client.get("/swagger", (err, req, res) => {
                    assert.isNull(err);

                    var openApiContent = restConfig.getAsString("openapi_content");
                    assert.equal(openApiContent, res.body);
        
                    callback();
                });
            },
        ], done);
    });

    test('Get OpenApi Spec From File', (done) => {
        let openApiContent = "swagger yaml content from file";
        let filename = 'dummy_'+ IdGenerator.nextLong() + '.tmp';

        var client = restify.createStringClient({ url: 'http://localhost:3000', version: '*' });

        async.series([
            // create temp file
            (callback) => {
                fs.writeFile(filename, openApiContent, callback);
            },
            // recreate service with new configuration
            (callback) => {
                service.close(null, callback);
            },
            (callback) => {
                let serviceConfig = ConfigParams.fromTuples(
                    "connection.protocol", "http",
                    "connection.host", "localhost",
                    "connection.port", 3000,
                    "openapi_file", filename,  // for test only
                    "swagger.enable", "true"
                );

                let ctrl = new DummyController();

                service = new DummyRestService();
                service.configure(serviceConfig);

                let references: References = References.fromTuples(
                    new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
                    new Descriptor('pip-services-dummies', 'service', 'rest', 'default', '1.0'), service
                );
                service.setReferences(references);

                service.open(null, callback);
            },
            (callback) => {
                client.get("/swagger", (err, req, res) => {
                    assert.isNull(err);

                    assert.equal(openApiContent, res.body);
        
                    callback();
                });
            },
            // delete temp file
            (callback) => {
                fs.unlink(filename, callback);
            },
        ], done);
    });
});
