'use strict';

const browlUtil = require('browl-util');
const commands = require('./commands');
const debug = require('debug')('browl:bulk');
const error = browlUtil.handleError;

/**
 * Bulk function for deploy processes
 *
 * @param {string} repo
 * @param {string[]} branches
 * @param {Object} [options]
 */
module.exports = function deployBulk(repo, branches, options) {
  debug('repo: %s, branches: %j, options: %j', repo, branches, options);

  options = options || {};

  const force = options.force || false;

  debug('force: %s', options.force);

  if (!repo) {
    return error('repo is not passed');
  }

  if (!branches) {
    return error('branches are not passed');
  }

  if (options.delete) {
    return commands.deleteBulk(repo, branches, force);
  }

  if (options.start) {
    return commands.startBulk(repo, branches, force);
  }

  if (options.stop) {
    return commands.stopBulk(repo, branches);
  }

  if (options.restart) {
    return commands.restartBulk(repo, branches);
  }

  return commands.upsertBulk(repo, branches);
};
