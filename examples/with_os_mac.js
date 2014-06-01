"use strict";
/**
 * @file example with os stat. MAC ONLY FOR NOW
 * @package monitode
 * @package monitode
 * @subpackage examples
 * @version 0.0.3
 * @author hex7c0 <0x7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var monitode = require('../index.js'); // use require('monitode') instead
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * use
 */
// using standalone
monitode({
    output: true,
    os: true,
});
