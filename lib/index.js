'use strict';

/**
 * Main function for deploy processes
 *
 * @param {string} repo
 * @param {string|null} branch
 * @param {Object} [options]
 */
module.exports = require('./deploy');

/**
 * Bulk function for deploy processes
 *
 * @param {string} repo
 * @param {string[]} branches
 * @param {Object} [options]
 */
module.exports.bulk = require('./bulk');

/**
 * Bulk function for deploy processes
 *
 * @param {string} repo
 * @param {string[]} branches
 * @param {Db} [options]
 */
module.exports.db = require('./db');
