'use strict';

function Options(yargs) {
  if (this instanceof Options) {
    this.yargs = yargs;
  } else {
    return new Options(yargs);
  }
}

Options.prototype.repo = function () {
  this.yargs.option('repo', {
    alias: 'r',
    demandOption: 'Provide repository',
    describe: 'Provide repository',
    type: 'string',
    nargs: 1
  });

  return this;
};

Options.prototype.branch = function (demandOption) {
  demandOption = typeof demandOption === 'undefined' ?
    true :
    demandOption;

  this.yargs.option('branch', {
    alias: 'b',
    demandOption: demandOption ?
      'Provide branch(es)' :
      false,
    describe: 'Provide branch(es)',
    type: 'string',
    array: true
  });

  return this;
};

Options.prototype.force = function () {
  this.yargs.option('force', {
    alias: 'f',
    type: 'boolean',
    describe: 'Force run'
  });

  return this;
};

Options.prototype.all = function () {
  this.yargs.option('all', {
    alias: 'a',
    type: 'boolean',
    describe: 'Indicates that all branches are affected for a command'
  });

  return this;
};

module.exports = Options;
