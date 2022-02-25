let assert = require('chai').assert;
let restify = require('restify-clients');
let async = require('async');

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { Dummy } from '../Dummy';
import { DummyController } from '../DummyController';
import { DummyCommandableHttpService } from './DummyCommandableHttpService';

//import * as fs from 'fs';

var restConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000,
    "swagger.enable", "true"
);


suite('DummyCommandableHttpService', ()=> {
    var _dummy1: Dummy;
    var _dummy2: Dummy;

    let headers: any = {};

    let service: DummyCommandableHttpService;

    let rest: any;

    suiteSetup((done) => {
        let ctrl = new DummyController();

        service = new DummyCommandableHttpService();
        service.configure(restConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
            new Descriptor('pip-services-dummies', 'service', 'http', 'default', '1.0'), service
        );
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*', headers: headers });

        _dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
        _dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [ { key: "SubKey 1", content: "SubContent 1"} ]};
    });

    test('CRUD Operations', (done) => {
        var dummy1, dummy2;

        async.series([
        // Create one dummy
            (callback) => {
                rest.post('/dummy/create_dummy',
                    {
                        dummy: _dummy1
                    },
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
                rest.post('/dummy/create_dummy', 
                    {
                        dummy: _dummy2
                    },
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
                rest.post('/dummy/get_dummies',
                    null,
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
                rest.post('/dummy/update_dummy',
                    {
                        dummy: dummy1
                    },
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
                rest.post('/dummy/delete_dummy',
                    {
                        dummy_id: dummy1.id
                    },
                    (err, req, res) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete dummy
            (callback) => {
                rest.post('/dummy/get_dummy_by_id',
                    { 
                        dummy_id: dummy1.id
                    },
                    (err, req, res, dummy) => {
                        assert.isNull(err);
                        // assert.isObject(dummy);
                        callback();
                    }
                );
            }
        ], done);
    });


    test('Check correlationId', (done) => {
        async.series([
            // check transmit correllationId over params
            (callback) => {
                rest.post("/dummy/check_correlation_id?correlation_id=test_cor_id",null, (err, req, res, item) => {
                    assert.isNull(err);
                    assert.equal(item["correlationId"], "test_cor_id");
                    callback();
                });
            },
            // check transmit correllationId over header
            (callback) => {
                headers["correlation_id"] = "test_cor_id_header"
                rest.post("/dummy/check_correlation_id", null, (err, req, res, item) => {
                    assert.isNull(err);
                    assert.equal(item["correlationId"], "test_cor_id_header");
                    callback();
                });
            },
        ], done);
    });
    

    test('Get OpenApi Spec', (done) => {
        let url = 'http://localhost:3000';
        var client = restify.createStringClient({ url: url, version: '*' });
        
        async.series([
            (callback) => {
                client.get("/dummy/swagger", (err, req, res) => {
                    assert.isNull(err);

                    assert.isTrue(res.body.startsWith("openapi:"));

                    // uncomment and copy to editor.swagger.io for check
                    // fs.writeFile('file.txt', res.body,  function(err) {
                    //     if (err) {
                    //         return console.error(err);
                    //     }
                    //     console.log("File created!");
                    // });
                    
                    callback();
                });
            },
        ], done);
    });

    test('OpenApi Spec Override', (done) => {
        let openApiContent = "swagger yaml content";

        let url = 'http://localhost:3000';
        var client = restify.createStringClient({ url: url, version: '*' });

        async.series([
            // recreate service with new configuration
            (callback) => {
                service.close(null, callback);
            },
            (callback) => {
                var config = restConfig.setDefaults(ConfigParams.fromTuples("swagger.auto", false));

                let ctrl = new DummyController();

                service = new DummyCommandableHttpService();
                service.configure(config);

                let references: References = References.fromTuples(
                    new Descriptor('pip-services-dummies', 'controller', 'default', 'default', '1.0'), ctrl,
                    new Descriptor('pip-services-dummies', 'service', 'http', 'default', '1.0'), service
                );
                service.setReferences(references);

                service.open(null, callback);
            },
            (callback) => {
                client.get("/dummy/swagger", (err, req, res) => {
                    assert.isNull(err);

                    assert.equal(openApiContent, res.body);
        
                    callback();
                });
            },
        ], done);
    });
});
