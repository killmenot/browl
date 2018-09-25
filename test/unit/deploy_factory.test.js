'use strict';

const deployFactory = require('../../lib/deploy_factory');

describe('deployFactory', () => {
  it('should return NullStrategy instance', () => {
    const repo = 'app0';
    const repoConfig = {};

    const deploy = deployFactory(repo, repoConfig);

    expect(deploy.name).equal('null');
  });

  it('should return NpmStrategy instance', () => {
    const repo = 'app1';
    const repoConfig = {
      deploy: 'npm'
    };

    const deploy = deployFactory(repo, repoConfig);

    expect(deploy.name).equal('npm');
  });

  it('should return MakeStrategy instance', () => {
    const repo = 'app2';
    const repoConfig = {
      deploy: 'make'
    };

    const deploy = deployFactory(repo, repoConfig);

    expect(deploy.name).equal('make');
  });

  it('should return instance of custom strategy', () => {
    const repo = 'app3';
    const repoConfig = {
      deploy: 'custom'
    };

    const deploy = deployFactory(repo, repoConfig);

    expect(deploy.name).equal('app3');
  });
});
