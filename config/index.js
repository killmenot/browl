'use strict';

const path = require('path');
const fs = require('fs-extra');
const ini = require('ini');

const CONFIG_DIR = process.env.CONFIG_DIR || '/etc/browl';
const CONFIG_INI = path.join(CONFIG_DIR, 'browl.ini');

const config = ini.parse(fs.readFileSync(CONFIG_INI, 'utf-8'));
config.dir = CONFIG_DIR;
config.conf_dir = path.join(CONFIG_DIR, 'conf.d');

config.loadRepoConfig = function (repo) {
  const filename = path.join(this.conf_dir, repo, 'config.ini');
  return ini.parse(fs.readFileSync(filename, 'utf-8'));
};

module.exports = config;