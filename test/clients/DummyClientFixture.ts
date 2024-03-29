let assert = require('chai').assert;
let async = require('async');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IDummyClient } from './IDummyClient';

export class DummyClientFixture {
    private _client: IDummyClient;

    public constructor(client: IDummyClient) {
        this._client = client;
    }

    public testCrudOperations(done: any): void {
        let dummy1 = { id: null, key: "Key 1", content: "Content 1", array: [ { key: "SubKey 1", content: "SubContent 1"} ] };
        let dummy2 = { id: null, key: "Key 2", content: "Content 2", array: [ { key: "SubKey 1", content: "SubContent 1"} ] };

        async.series([
            // Create one dummy
            (callback) => {
                this._client.createDummy(
                    null,
                    dummy1,
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.content, dummy1.content);
                        assert.equal(dummy.key, dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
            // Create another dummy
            (callback) => {
                this._client.createDummy(
                    null,
                    dummy2,
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.content, dummy2.content);
                        assert.equal(dummy.key, dummy2.key);

                        dummy2 = dummy;

                        callback();
                    }
                );
            },
            // Get all dummies
            (callback) => {
                this._client.getDummies(
                    null,
                    new FilterParams(),
                    new PagingParams(0, 5, false),
                    (err, dummies) => {
                        assert.isNull(err);

                        assert.isObject(dummies);
                        assert.isTrue(dummies.data.length >= 2);

                        callback();
                    }
                );
            },
            // Update the dummy
            (callback) => {
                dummy1.content = 'Updated Content 1';
                this._client.updateDummy(
                    null,
                    dummy1,
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isObject(dummy);
                        assert.equal(dummy.content, 'Updated Content 1');
                        assert.equal(dummy.key, dummy1.key);

                        dummy1 = dummy;

                        callback();
                    }
                );
            },
            // Delete dummy
            (callback) => {
                this._client.deleteDummy(
                    null,
                    dummy1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            // Try to get delete dummy
            (callback) => {
                this._client.getDummyById(
                    null,
                    dummy1.id,
                    (err, dummy) => {
                        assert.isNull(err);

                        assert.isNull(dummy || null);

                        callback();
                    }
                );
            },
            // Check correlation id
            (callback) => {
                this._client.checkCorrelationId(
                    "test_cor_id",
                    (err, result) => {
                        assert.isNull(err);
                        assert.isNotNull(result);
                        assert.equal(result["correlationId"], "test_cor_id");
                        callback();
                    }
                );
            }
        ], done);
    }

}
