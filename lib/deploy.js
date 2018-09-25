'use strict';

const browlUtil = require('browl-util');
const commands = require('./commands');
const db = require('./db');
const debug = require('debug')('deploy');
const error = browlUtil.handleError;

/**
 * Main function for deploy processes
 *
 * @param {string} repo
 * @param {string|null} branch
 * @param {Object} [options]
 */
module.exports = function deploy(repo, branch, options) {
  debug('repo: %s, branch: %s, options: %j', repo, branch, options);

  options = options || {};

  const force = options.force || false;
  const all = options.all || false;

  debug('force: %s', options.force);
  debug('all: %s', options.all);

  if (options.startall) {
    return commands.startAll(force);
  }

  if (options.stopall) {
    return commands.stopAll();
  }

  if (options.restartall) {
    return commands.restartAll();
  }

  if (options.list) {
    return commands.list();
  }

  if (!repo) {
    return error('repo is not passed');
  }

  if (!all && !branch) {
    return error('branch is not passed');
  }

  if (options.delete && options.all) {
    return commands.deleteAll(repo, force);
  }

  if (options.delete) {
    return commands.delete(repo, branch, force);
  }

  if (options.start && options.all) {
    return commands.startAll(repo, force);
  }

  if (options.start) {
    return commands.start(repo, branch, force);
  }

  if (options.stop && options.all) {
    return commands.stopAll(repo);
  }

  if (options.stop) {
    return commands.stop(repo, branch);
  }

  if (options.restart && options.all) {
    return commands.restartAll(repo);
  }

  if (options.restart) {
    return commands.restart(repo, branch);
  }

  if (db.exists(repo, branch)) {
    return commands.update(repo, branch);
  }

  return commands.create(repo, branch);
};
