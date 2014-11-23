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
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('os', function() {

  var r = '127.0.0.1:30002/dyn/';
  var p = 'Basic ' + new Buffer('admin:password').toString('base64');
  before(function(done) {

    monitode({
      output: false,
      os: true,
      http: {
        port: 30002
      }
    });
    done();
  });

  describe('OS stats', function() {

    it('should return 0 stats', function(done) {

      var p = 'Basic ' + new Buffer('admin:password').toString('base64');
      request.post(r).set('Authorization', p).set('Accept', 'application/json')
          .end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 200);
            var j = JSON.parse(res.text);

            assert.equal(typeof j.net, 'object', 'net');
            assert.equal(typeof j.net.inn, 'object', 'net');
            assert.equal(j.net.inn.pacs, 0, 'in pacs');
            assert.equal(j.net.inn.errs, 0, 'in error');

            assert.equal(typeof j.net.out, 'object', 'net');
            assert.equal(j.net.out.pacs, 0, 'out pacs');
            assert.equal(j.net.out.errs, 0, 'out error');

            assert.equal(typeof j.io, 'object', 'io');
            assert.equal(j.io.tps, 0, 'tps');
            assert.equal(j.io.mbs, 0, 'mbs');

            done();
          });
    });
    it('should return >= 0 stats', function(done) {

      request.post(r).set('Authorization', p).set('Accept', 'application/json')
          .end(function(err, res) {

            if (err)
              throw err;
            assert.equal(res.statusCode, 200);
            var j = JSON.parse(res.text);

            assert.equal(j.net.inn.pacs >= 0, true, 'in pacs');
            assert.equal(j.net.inn.errs >= 0, true, 'in error');
            assert.equal(j.net.out.pacs >= 0, true, 'out pacs');
            assert.equal(j.net.out.errs >= 0, true, 'out error');
            assert.equal(j.io.tps >= 0, true, 'tps');
            assert.equal(j.io.mbs >= 0, true, 'mbs');

            done();
          });
    });
  });
});
