'use strict';

const config = require('../config');
const YamlDb = require('browl-yaml');
const MemoryDb = require('browl-memory');

let db;

switch (config.db.engine) {
  case 'yaml':
    db = new YamlDb(config.db.yaml);
    break;

  default:
    db = new MemoryDb();
    break;
}

module.exports = db;
