'use strict';

const path = require('path');
const fs = require('fs');
const config = require('../config');
const browlUtil = require('browl-util');
const debug = require('debug')('browl:plugins');

const pluginUtil = {
  resolve: (pluginName) => {
    return path.join(config.plugins_dir, 'lib/node_modules', pluginName);
  },
  isPluginInstalled: (pluginName) => {
    return fs.existsSync(pluginUtil.resolve(pluginName));
  }
};

module.exports = (repoConfig) => {
  debug('initialize plugins: %j', repoConfig.plugins);

  const options = {
    cwd: config.plugins_dir,
    global: true
  };
  debug('options: %j', options);

  const plugins = repoConfig.plugins.map((pluginName) => {
    debug('process %s', pluginName);

    if (pluginUtil.isPluginInstalled(pluginName)) {
      debug('%s plugin is already installed', pluginName);
    } else {
      browlUtil.installModule(pluginName, options);
      debug('%s plugin has been installed', pluginName);
    }

    return pluginName;
  });

  return (strategy) => {
    debug('loading plugins: %j', plugins);
    plugins.reduce((strategy, pluginName) => {
      const pathToPlugin = pluginUtil.resolve(pluginName);
      debug('loading %s from %s', pluginName, pathToPlugin);
      const plugin = require(pluginName)(strategy);

      return plugin(strategy);
    }, strategy);
  };
};
