'use strict';
/**
 * @file db test
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
  var mongoClient = require('mongodb').MongoClient;
  var MURI = process.env.MURI;
} catch (MODULE_NOT_FOUND) {
  console.error(MODULE_NOT_FOUND);
  process.exit(1);
}

/*
 * test module
 */
describe('db', function() {

  var DOCS = {};

  describe('mongo', function() {

    it('should return data before save', function(done) {

      mongoClient.connect(MURI, function(err, db) {

        db.collection('monitode', function(err, collection) {

          collection.find({}, {
            sort: {
              date: -1
            }
          }).toArray(function(err, docs) {

            DOCS = docs;
            if (docs.length > 0) {
              assert.notEqual(docs[0].date, undefined);
              assert.notEqual(docs[0].ns, undefined);
              assert.notEqual(docs[0].uptime, undefined);
              assert.notEqual(docs[0].cpu, undefined);
              assert.notEqual(docs[0].mem, undefined);
            }
            db.close();
            done();
          });
        });
      });
    });
    it('should return data after save', function(done) {

      monitode({
        output: true,
        http: {
          enabled: false,
        },
        db: {
          mongo: MURI
        },
      });
      setTimeout(function() {

        mongoClient.connect(MURI, function(err, db) {

          db.collection('monitode', function(err, collection) {

            collection.find({}, {
              sort: {
                date: -1
              }
            }).toArray(function(err, docs) {

              assert.equal(docs.length > DOCS.length, true);
              if (DOCS.length > 0) {
                assert.notEqual(String(docs[0]._id), String(DOCS[0]._id));
              }
              assert.notEqual(docs[0].date, undefined);
              assert.notEqual(docs[0].ns, undefined);
              assert.notEqual(docs[0].uptime, undefined);
              assert.notEqual(docs[0].cpu, undefined);
              assert.notEqual(docs[0].mem, undefined);
              db.close();
              done();
            });
          });
        });
      }, 1000);
    });
  });

});
