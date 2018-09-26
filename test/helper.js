'use strict';

const path = require('path');
const chai = require('chai');
const sinonChai = require('sinon-chai');

process.env.BROWL_CONFIG_DIR = path.join(__dirname, '/support/config');
process.env.NODE_ENV = 'test';

chai.use(sinonChai);

global.expect = chai.expect;
