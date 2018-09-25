'use strict';

const fs = require('fs-extra');
const deploy = require('../../lib/deploy');
const db = require('../../lib/db');

describe('deploy', () => {
  async function seeds() {
    await deploy('webapp', 'feature/feature-10');
  }

  beforeEach(() => {
    db.setStorage({});
  });

  afterEach(() => {
    fs.removeSync('tmp/www');
  });

  it('should return repo is not passed error', async () => {
    try {
      await deploy();
    } catch (err) {
      expect(err).equal('repo is not passed');
    }
  });

  it('should return branches is not passed error', async () => {
    try {
      await deploy('webapp');
    } catch (err) {
      expect(err).equal('branch is not passed');
    }
  });

  it('should deploy the instance', async () => {
    const expectedStorage = {
      webapp: [
        'feature/feature-10'
      ]
    };
    const expectedContent = '<h1>feature/feature-10</h1>';

    await deploy('webapp', 'feature/feature-10');

    const actualStorage = db.getStorage();
    expect(actualStorage).eql(expectedStorage);

    const actualContent = fs.readFileSync('tmp/www/webapp/feature-feature-10/index.html').toString().trim();
    expect(actualContent).equal(expectedContent);
  });

  it('should deploy the instance (update)', async () => {
    const expectedStorage = {
      webapp: [
        'feature/feature-10'
      ]
    };
    const expectedContent = '<h1>feature/feature-10</h1>';

    await seeds();

    await deploy('webapp', 'feature/feature-10');

    const actualStorage = db.getStorage();
    expect(actualStorage).eql(expectedStorage);

    const actualContent = fs.readFileSync('tmp/www/webapp/feature-feature-10/index.html').toString().trim();
    expect(actualContent).equal(expectedContent);
  });

  it('should delete the instance', async () => {
    await seeds();

    await deploy('webapp', 'feature/feature-10', {delete: true});

    expect(db.getStorage()).eql({});

    const actual = fs.existsSync('tmp/www/webapp/feature-feature-10/index.html');
    expect(actual).equal(false);
  });

  it('should delete all repo instances', async () => {
    await seeds();

    await deploy('webapp', null, {delete: true, all: true});

    expect(db.getStorage()).eql({});

    const actual = fs.existsSync('tmp/www/webapp/feature-feature-10/index.html');
    expect(actual).equal(false);
  });

  it('should start the instance', async () => {
    await seeds();

    await deploy('webapp', 'feature/feature-10', {start: true});

    // TODO: think how to test it
  });

  it('should start all repo instances', async () => {
    await seeds();

    await deploy('webapp', null, {start: true, all: true});

    // TODO: think how to test it
  });

  it('should start all instances', async () => {
    await seeds();

    await deploy(null, null, {startall: true});

    // TODO: think how to test it
  });

  it('should stop the instance', async () => {
    await seeds();

    await deploy('webapp', 'feature/feature-10', {stop: true});

    // TODO: think how to test it
  });

  it('should stop all repo instances', async () => {
    await seeds();

    await deploy('webapp', null, {stop: true, all: true});

    // TODO: think how to test it
  });

  it('should stop all instances', async () => {
    await seeds();

    await deploy(null, null, {stopall: true});

    // TODO: think how to test it
  });

  it('should restart the instance', async () => {
    await seeds();

    await deploy('webapp', 'feature/feature-10', {restart: true});

    // TODO: think how to test it
  });

  it('should restart all repo instances', async () => {
    await seeds();

    await deploy('webapp', null, {restart: true, all: true});

    // TODO: think how to test it
  });

  it('should restart all instances', async () => {
    await seeds();

    await deploy(null, null, {restartall: true});

    // TODO: think how to test it
  });

  it('should display list of instances', async () => {
    const expected = JSON.stringify({
      webapp: ['feature/feature-10']
    }, null, 2);

    await seeds();

    const actual = deploy(null, null, {list:true});

    expect(actual).equal(expected);
  });
});
