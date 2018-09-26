'use strict';

const fs = require('fs-extra');
const path = require('path');
const P = require('bluebird');
const rimrafAsync = P.promisify(require('rimraf'));
const browlUtil = require('browl-util');
const debug = require('debug')('browl:commands');
const config = require('../config');
const db = require('./db');
const deployFactory = require('./deploy_factory');

const error = browlUtil.handleError;
const success = browlUtil.handleSuccess;

function validate(repo, branches) {
  return branches.filter(x => !db.exists(repo, x));
}

function create(repo, branch) {
  debug('create: repo = %s, branch = %s', repo, branch);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (db.exists(repo, branch)) {
    return error('Branch "' + branch + '" of repo "' + repo + '" is already deployed.');
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return db.add(repo, branch)
    .then(() => {
      return fs.ensureDir(options.cwd);
    })
    .then(() => {
      return browlUtil.run('git', ['clone', '-b', branch, repoConfig.url, '.'], options);
    })
    .then(() => {
      return deploy.create(branch, options);
    })
    .then(() => {
      return success('Created deployment of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function update(repo, branch) {
  debug('upsert: repo = %s, branch = %s', repo, branch);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (!db.exists(repo, branch)) {
    return error('Branch "' + branch + '" of repo "' + repo + '" is not deployed.');
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return browlUtil.run('git', ['pull', 'origin', branch], options)
    .then(() => {
      return deploy.update(branch, options);
    })
    .then(() => {
      return success('Updated deployment of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function upsertBulk(repo, branches) {
  debug('upsert bulk: repo = %s, branches = %s', repo, branches);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branches) {
    return error('branches is missed.');
  }

  const promises = branches.map(x => db.exists(repo, x) ? update(repo, x) : create(repo, x));

  return Promise.all(promises).catch(error);
}

function del(repo, branch, force) {
  debug('delete: repo = %s, branch = %s, force = %s', repo, branch, force);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (!db.exists(repo, branch)) {
    const err = 'Branch "' + branch + '" of repo "' + repo + '" is not deployed.';
    if (force) {
      browlUtil.log('[commands|delete] ignore: ' + err);
    } else {
      return error(err);
    }
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    force: force,
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return db.remove(repo, branch)
    .then(() => {
      return deploy.delete(branch, options);
    })
    .then(() => {
      return rimrafAsync(options.cwd);
    })
    .then(() => {
      return success('Removed deployment of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function deleteBulk(repo, branches, force) {
  debug('delete bulk: repo = %s, branches = %s, force = %s', repo, branches, force);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branches) {
    return error('branches is missed.');
  }

  const errors = validate(repo, branches);
  if (errors.length > 0) {
    const err = 'Branches: "' + errors.join(', ') + '" of repo "' + repo + '" are not deployed.';
    if (force) {
      browlUtil.log('[commands|deleteBulk] ignore: ' + err);
    } else {
      return error(err);
    }
  }

  const promises = branches.map(x => del(repo, x, force));

  return Promise.all(promises).catch(branches);
}

function deleteAll(repo, force) {
  debug('delete all: repo = %s, force = %s', repo, force);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!db.exists(repo)) {
    const err = 'Repo "' + repo + '" has no deployed instances.';
    if (force) {
      browlUtil.log('[commands|deleteAll] ignore: ' + err);
    } else {
      return error(err);
    }
  }

  const branches = db.branches(repo);
  const promises = branches.map(x => del(repo, x, force));

  return Promise.all(promises).catch(error);
}

function list() {
  const data = db.list();
  const hasInstances = (x) => x && x !== '{}\n';

  return hasInstances(data) ? data : 'No configured instances.';
}

function start(repo, branch, force) {
  debug('start bulk: repo = %s, branch = %s', repo, branch);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (!db.exists(repo, branch)) {
    return error('Branch "' + branch + '" of repo "' + repo + '" is not deployed.');
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    force: force,
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return deploy.start(branch, options)
    .then(() => {
      return success('Started the instance of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function startBulk(repo, branches, force) {
  debug('start bulk: repo = %s, branches = %s, force = %s', repo, branches, force);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branches) {
    return error('branches is missed.');
  }

  const errors = validate(repo, branches);
  if (errors.length > 0) {
    return browlUtil.errorLog('Branches: "' + errors.join(', ') + '" of repo "' + repo + '" are not deployed.');
  }

  const promises = branches.map(x => start(repo, x, force));

  return Promise.all(promises).catch(error);
}

function startAll(repo, force) {
  debug('start all: repo = %s, force = %s', repo, force);

  if (typeof repo === 'boolean') {
    force = repo;
    repo = null;
  }

  const instances = db.instances(repo);
  const promises = instances.map(x => start(x.repo, x.branch, force));

  return Promise.all(promises).catch(error);
}

function stop(repo, branch) {
  debug('stop: repo = %s, branch = %s', repo, branch);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (!db.exists(repo, branch)) {
    return error('Branch "' + branch + '" of repo "' + repo + '" is not deployed.');
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return deploy.stop(branch, options)
    .then(() => {
      return success('Stopped the instance of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function stopBulk(repo, branches) {
  debug('stop bulk: repo = %s, branches = %s', repo, branches);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branches) {
    return error('branches is missed.');
  }

  const errors = validate(repo, branches);
  if (errors.length > 0) {
    return error('Branches: "' + errors.join(', ') + '" of repo "' + repo + '" are not deployed.');
  }

  const promises = branches.map(x => stop(repo, x));

  return Promise.all(promises).catch(error);
}

function stopAll(repo) {
  debug('stop all: repo = %s', repo);

  const instances = db.instances(repo);
  const promises = instances.map(x => stop(x.repo, x.branch));

  return Promise.all(promises).catch(error);
}

function restart(repo, branch) {
  debug('restart: repo = %s, branch = %s', repo, branch);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branch) {
    return error('branch is missed.');
  }

  if (!db.exists(repo, branch)) {
    return error('Branch "' + branch + '" of repo "' + repo + '" is not deployed.');
  }

  const branchClean = browlUtil.clean(branch);
  const repoConfig = config.loadRepoConfig(repo);
  const deploy = deployFactory(repo, repoConfig);
  const options = {
    cwd: path.join(repoConfig.root, branchClean),
    env: Object.assign({
      NODE_ENV: branchClean
    }, process.env)
  };

  return deploy.restart(branch, options)
    .then(() => {
      return success('Restarted the instance of branch "' + branch + '" of repo "' + repo + '" successfully.');
    })
    .catch(error);
}

function restartBulk(repo, branches) {
  debug('restart bulk: repo = %s, branches = %s', repo, branches);

  if (!repo) {
    return error('repo is missed.');
  }

  if (!branches) {
    return error('branches is missed.');
  }

  const errors = validate(repo, branches);
  if (errors.length > 0) {
    return error('Branches: "' + errors.join(', ') + '" of repo "' + repo + '" are not deployed.');
  }

  const promises = branches.map(x => restart(repo, x));

  return Promise.all(promises).catch(error);
}

function restartAll(repo) {
  debug('restart all: %s', repo);

  const instances = db.instances(repo);
  const promises = instances.map(x => restart(x.repo, x.branch));

  return Promise.all(promises).catch(error);
}

module.exports = {
  create: create,
  update: update,
  upsertBulk: upsertBulk,
  delete: del,
  deleteBulk: deleteBulk,
  deleteAll: deleteAll,
  list: list,
  start: start,
  startBulk: startBulk,
  startAll: startAll,
  stop: stop,
  stopBulk: stopBulk,
  stopAll: stopAll,
  restart: restart,
  restartBulk: restartBulk,
  restartAll: restartAll
};
