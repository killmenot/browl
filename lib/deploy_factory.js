'use strict';

const browlLoader = require('browl-loader');
const MakeStrategy = require('browl-make');
const NullStrategy = require('browl-null');
const NpmStrategy = require('browl-npm');
const debug = require('debug')('deploy-factory');
const config = require('../config');
const browlPlugins = require('./plugins');

function resolveStrategy(repo, repoConfig) {
  if (repoConfig.deploy === 'make') {
    return MakeStrategy;
  }

  if (repoConfig.deploy === 'npm') {
    return NpmStrategy;
  }

  if (repoConfig.deploy === 'custom') {
    return browlLoader(config, repo, repoConfig);
  }

  return NullStrategy;
}

module.exports = (repo, repoConfig) => {
  debug('repo: %s, repoConfig: %j', repo, repoConfig);

  const Strategy = resolveStrategy(repo, repoConfig);
  const strategy = new Strategy(repo, config, repoConfig);

  debug('using %s strategy', strategy.name);

  if (repoConfig.plugins) {
    browlPlugins(repoConfig)(strategy);
  }

  return strategy;
};
