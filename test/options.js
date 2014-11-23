'use strict';
/**
 * @file options test
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
  var assert = require('assert');
  var fs = require('fs');
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('options', function() {

  before(function(done) {

    monitode({
      output: false,
      os: true,
      http: {
        enabled: false
      },
      logger: {
        file: 'boh',
        timeout: 100000
      }
    });
    done();
  });

  it('should correct options', function(done) {

    var o = global.monitode;
    assert.equal(o.output, false);
    assert.equal(o.tickle, false);
    assert.equal(o.app, false);
    assert.equal(o.os, true);
    assert.deepEqual(o.monitor, {
      os: true,
      log: true
    });
    assert.deepEqual(o.logger.timeout, 100000 * 1000);
    fs.unlink('boh', function() {

      done();
    });
  });
});
