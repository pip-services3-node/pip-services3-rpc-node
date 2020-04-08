let assert = require('chai').assert;

import { ConfigParams, ConfigException } from 'pip-services3-commons-node';

import { HttpConnectionResolver } from '../../src/connect/HttpConnectionResolver';

suite('HttpConnectionResolver', () => {

    test('Resolve URI', (done) => {
        let resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.uri", "http://somewhere.com:777"
        ));

        resolver.resolve(null, (err, connection) => {
            assert.equal("http", connection.getProtocol());
            assert.equal("somewhere.com", connection.getHost());
            assert.equal(777, connection.getPort());

            done();
        });
    });

    test('Resolve Parameters', (done) => {
        let resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.protocol", "http",
            "connection.host", "somewhere.com",
            "connection.port", 777
        ));

        resolver.resolve(null, (err, connection) => {
            assert.equal("http://somewhere.com:777", connection.getUri());

            done();
        });
    });

    test('TestHttpsWithCredentialsConnectionParams', (done) => {

        let resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https",
            "credential.ssl_key_file", "ssl_key_file",
            "credential.ssl_crt_file", "ssl_crt_file"
        ));

        resolver.resolve(null, (err, connection) => {
            assert.equal("https", connection.getProtocol());
            assert.equal("somewhere.com", connection.getHost());
            assert.equal(123, connection.getPort());
            assert.equal("https://somewhere.com:123", connection.getUri());
            assert.equal("ssl_key_file", connection.get("credential.ssl_key_file"));
            assert.equal("ssl_crt_file", connection.get("credential.ssl_crt_file"));

            done();
        });
    });

    test('TestHttpsWithNoCredentialsConnectionParams', (done) => {

        let resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https",
            "credential.internal_network", "internal_network"
        ));

        resolver.resolve(null, (err, connection) => {
            assert.equal("https", connection.getProtocol());
            assert.equal("somewhere.com", connection.getHost());
            assert.equal(123, connection.getPort());
            assert.equal("https://somewhere.com:123", connection.getUri());
            assert.isNull(connection.get("credential.internal_network"));

            done();
        });
    });

    test('TestHttpsWithMissingCredentialsConnectionParams', (done) => {

        // section missing
        let resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https"
        ));

        resolver.resolve(null, (err, connection) => {
            console.log("Test - section missing");
            assert.isNotNull(err);
            assert.equal("NO_CREDENTIAL", err.code);
            assert.equal("NO_CREDENTIAL", err.name);
            assert.equal("SSL certificates are not configured for HTTPS protocol", err.message);
            assert.equal("Misconfiguration", err.category);
        });

        // ssl_crt_file missing
        resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https",
            "credential.ssl_key_file", "ssl_key_file"
        ));

        resolver.resolve(null, (err, connection) => {
            console.log("Test - ssl_crt_file missing");
            assert.isNotNull(err);
            assert.equal("NO_SSL_CRT_FILE", err.code);
            assert.equal("NO_SSL_CRT_FILE", err.name);
            assert.equal("SSL crt file is not configured in credentials", err.message);
            assert.equal("Misconfiguration", err.category);
        });

        // ssl_key_file missing
        resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https",
            "credential.ssl_crt_file", "ssl_crt_file"
        ));

        resolver.resolve(null, (err, connection) => {
            console.log("Test - ssl_key_file missing");
            assert.isNotNull(err);
            assert.equal("NO_SSL_KEY_FILE", err.code);
            assert.equal("NO_SSL_KEY_FILE", err.name);
            assert.equal("SSL key file is not configured in credentials", err.message);
            assert.equal("Misconfiguration", err.category);
        });

        // ssl_key_file,  ssl_crt_file present
        resolver = new HttpConnectionResolver();
        resolver.configure(ConfigParams.fromTuples(
            "connection.host", "somewhere.com",
            "connection.port", 123,
            "connection.protocol", "https",
            "credential.ssl_key_file", "ssl_key_file",
            "credential.ssl_crt_file", "ssl_crt_file"
        ));

        resolver.resolve(null, (err, connection) => {
            console.log("Test - ssl_key_file,  ssl_crt_file present");
            assert.equal("https", connection.getProtocol());
            assert.equal("somewhere.com", connection.getHost());
            assert.equal(123, connection.getPort());
            assert.equal("https://somewhere.com:123", connection.getUri());
            assert.equal("ssl_key_file", connection.get("credential.ssl_key_file"));
            assert.equal("ssl_crt_file", connection.get("credential.ssl_crt_file"));

            done();
        });
    });
});
