'use strict';

const browlUtil = require('browl-util');
const browlLoader = require('browl-loader');
const MakeStrategy = require('browl-make');
const NullStrategy = require('browl-null');
const NpmStrategy = require('browl-npm');
const debug = require('debug')('deploy-factory');
const config = require('../config');

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
    debug('initialize plugins: %j', repoConfig.plugins);
    repoConfig.plugins.reduce((strategy, pluginName) => {
      browlUtil.installModule(pluginName);

      const index = pluginName.indexOf('/');

      const plugin = index > -1 ?
        require(pluginName.slice(index + 1)) :
        require(pluginName);

      return plugin(strategy);
    }, strategy);
  }

  return strategy;
};
