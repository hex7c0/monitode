'use strict';
/**
 * @file http test
 * @module monitode
 * @package monitode
 * @subpackage test
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
  var monitode = require('..');
  var request = require('superagent');
  var assert = require('assert');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('http', function() {

  before(function(done) {

    monitode({
      output: false,
      http: {
        port: 3001,
        user: 'pippo',
        password: 'ciao'
      }
    });
    done();
  });

  describe('should return right status code', function() {

    it('for dynamic contents', function(done) {

      var p = 'Basic ' + new Buffer('pippo:ciao').toString('base64');
      request.post('127.0.0.1:3001/dyn/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 200);
            done();
          });
    });
    it('for static contents', function(done) {

      var OS = require('os');
      var d = {
        os: {
          hostname: OS.hostname(),
          platform: OS.platform(),
          arch: OS.arch(),
          type: OS.type(),
          release: OS.release(),
        },
        version: process.versions,
        process: {
          gid: process.getgid(),
          uid: process.getuid(),
          pid: process.pid,
          env: process.env,
        },
        network: OS.networkInterfaces(),
        endianness: OS.endianness(),
      };
      var p = 'Basic ' + new Buffer('pippo:ciao').toString('base64');
      request.post('http://127.0.0.1:3001/sta/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            var j = JSON.parse(res.text);
            assert.equal(res.statusCode, 200, '200');
            assert.deepEqual(j.os, d.os, 'os');
            assert.deepEqual(j.version, d.version, 'version');
            assert.deepEqual(j.process, d.process, 'process');
            assert.deepEqual(j.process, d.process, 'process');
            assert.deepEqual(j.endianness, d.endianness, 'endianness');
            done();
          });
    });
  });

  describe('should return error code', function() {

    it('401', function(done) {

      var p = 'Basic ' + new Buffer('pip2po:ciao').toString('base64');
      request.post('http://127.0.0.1:3001/dyn/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 401);
            done();
          });
    });
    it('404', function(done) {

      var p = 'Basic ' + new Buffer('pippo:ciao').toString('base64');
      request.post('http://127.0.0.1:3001/ssta/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 404);
            done();
          });
    });
    it('404', function(done) {

      var p = 'Basic ' + new Buffer('pippo:ciao').toString('base64');
      request.get('http://127.0.0.1:3001/dyn/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 404);
            done();
          });
    });
    it('404', function(done) {

      var p = 'Basic ' + new Buffer('pippo:ciao').toString('base64');
      request.get('http://127.0.0.1:3001/sta/').set('Authorization', p)
          .set('Accept', 'application/json').end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 404);
            done();
          });
    });
  });
});
