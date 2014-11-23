'use strict';
/**
 * @file os test
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
  var fs = require('fs');
  var logger = require('logger-request');
  var tickle = require('tickle');
  var express = require('express');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('logger', function() {

  var rG0 = '127.0.0.1:3000/';
  var rG1 = '127.0.0.1:3001/';
  var rP0 = '127.0.0.1:30000/dyn/';
  var rP1 = '127.0.0.1:30001/dyn/';
  var p = 'Basic ' + new Buffer('admin:password').toString('base64');
  var file = __dirname + '/example.log';
  var event;

  describe('with tickle', function() {

    before(function(done) {

      monitode({
        logger: {
          log: file,
          timeout: 1
        }
      });
      var app = express();
      app.use(logger({
        filename: file,
        timestamp: Date.now,
        json: true,
      }));
      app.use(tickle);
      app.get('/', function(req, res) {

        res.send('hello world!');
      });
      app.listen(3000);
      done();
    });

    describe('init', function() {

      it('should return empty Object', function(done) {

        request.post(rP0).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.equal(typeof j.tickle, 'object', 'tickle');
              assert.equal(typeof j.event, 'object', 'event');
              assert.equal(typeof j.log, 'object', 'log');
              assert.equal(j.log.counter, 0, 'counter');
              assert.equal(j.log.size, 0, 'size');
              done();
            });
      });
    });

    describe('http request', function() {

      it('/', function(done) {

        request.get(rG0).end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 200);
          done();
        });
      });
      it('GET /', function(done) {

        request.get(rG0).end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 200);
          done();
        });
      });
      it('GET /pippo', function(done) {

        request.get(rG0 + 'pippo').end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 404);
          done();
        });
      });
      it('POST /pippo', function(done) {

        request.post(rG0 + 'pippo').end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 404);
          done();
        });
      });
    });

    describe('after request', function() {

      it('should return "tickle" Object', function(done) {

        request.post(rP0).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.equal(Object.keys(j.event).length, 0);
              assert.equal(j.tickle['/'], 2);
              assert.equal(j.tickle['/pippo'], 2);
              assert.equal(j.log.counter, 0, 'counter');
              assert.equal(j.log.size, 0, 'size');
              done();
            });
      });
      it('should return "logger" Object', function(done) {

        request.post(rP0).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.equal(j.event['/']['GET']['200'].counter, 2);
              assert.equal(j.event['/pippo']['GET']['404'].counter, 1);
              assert.equal(j.event['/pippo']['POST']['404'].counter, 1);
              assert.equal(Object.keys(j.event).length, 2);
              assert.equal(Object.keys(j.event['/']).length, 1);
              assert.equal(Object.keys(j.event['/']['GET']).length, 1);
              assert.equal(Object.keys(j.event['/pippo']).length, 2);
              assert.equal(Object.keys(j.event['/pippo']['GET']).length, 1);
              assert.equal(Object.keys(j.event['/pippo']['POST']).length, 1);
              assert.equal(j.tickle['/'], 2);
              assert.equal(j.tickle['/pippo'], 2);
              assert.equal(j.log.counter > 0, true, 'counter');
              assert.equal(j.log.size > 0, true, 'size');
              event = j.event;
              done();
            });
      });
    });

    after(function(done) {

      delete global.tickle;
      delete global.monitode;
      done();
    });
  });

  describe('without tickle', function() {

    before(function(done) {

      monitode({
        logger: {
          log: file,
          timeout: 1
        },
        http: {
          port: 30001
        }
      });
      var app = express();
      app.use(logger({
        filename: file,
        json: true,
      }));
      app.get('/', function(req, res) {

        res.send('hello world!');
      });
      app.listen(3001);
      done();
    });

    describe('init', function() {

      it('should return empty Object', function(done) {

        request.post(rP1).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.equal(j.tickle, undefined, 'tickle');
              assert.equal(typeof j.event, 'object', 'event');
              assert.equal(typeof j.log, 'object', 'log');
              assert.equal(j.log.counter, 0, 'counter');
              assert.equal(j.log.size, 0, 'size');
              done();
            });
      });
    });

    describe('http request', function() {

      it('/', function(done) {

        request.get(rG1).end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 200);
          done();
        });
      });
      it('GET /', function(done) {

        request.get(rG1).end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 200);
          done();
        });
      });
      it('GET /pippo', function(done) {

        request.get(rG1 + 'pippo').end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 404);
          done();
        });
      });
      it('POST /pippo', function(done) {

        request.post(rG1 + 'pippo').end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 404);
          done();
        });
      });
    });

    describe('after request', function() {

      it('should return "logger" Object equal to before', function(done) {

        request.post(rP1).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.deepEqual(j.event, event);
              assert.equal(j.log.counter > 0, true, 'counter');
              assert.equal(j.log.size > 0, true, 'size');
              done();
            });
      });
      it('should return "logger" Object after another request', function(done) {

        request.post(rP1).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.deepEqual(j.event, event);
              assert.equal(j.log.counter > 0, true, 'counter');
              assert.equal(j.log.size > 0, true, 'size');
              done();
            });
      });
    });

    describe('last request', function() {

      it('should build another request on /pluto', function(done) {

        request.post(rG1 + 'pippo').end(function(err, res) {

          if (err)
            throw err;
          assert.equal(res.statusCode, 404);
          request.post(rP1).set('Authorization', p)
              .set('Accept', 'application/json').end(function(err, res) {

                if (err)
                  throw err;
                assert.equal(res.statusCode, 200);
                var j = JSON.parse(res.text);
                assert.deepEqual(j.event, {});// refresh event
                done();
              });
        });
      });
      it('should return last "logger" Object', function(done) {

        request.post(rP1).set('Authorization', p)
            .set('Accept', 'application/json').end(function(err, res) {

              if (err)
                throw err;
              assert.equal(res.statusCode, 200);
              var j = JSON.parse(res.text);
              assert.deepEqual(j.event, {
                '/pippo': {
                  POST: {
                    '404': {
                      counter: 1
                    }
                  }
                }
              });
              done();
            });
      });
    });
  });

  after(function(done) {

    fs.unlink(file, function() {

      done();
    });
  });
});
