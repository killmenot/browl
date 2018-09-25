'use strict';

const fs = require('fs-extra');
const deployBulk = require('../../lib/bulk');
const db = require('../../lib/db');

describe('bulk', () => {

  async function seeds() {
    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20']);
  }

  beforeEach(() => {
    db.setStorage({});
  });

  afterEach(() => {
    fs.removeSync('tmp/www');
  });

  it('should return repo is not passed error', async () => {
    try {
      await deployBulk();
    } catch (err) {
      expect(err).equal('repo is not passed');
    }
  });

  it('should return branches is not passed error', async () => {
    try {
      await deployBulk('webapp');
    } catch (err) {
      expect(err).equal('branches are not passed');
    }
  });

  it('should deploy multiple instances', async () => {
    const expectedStorage = {
      webapp: [
        'feature/feature-10',
        'feature/feature-20'
      ]
    };
    const expectedContent = {
      'feature-feature-10': '<h1>feature/feature-10</h1>',
      'feature-feature-20': '<h1>feature/feature-20</h1>',
    };

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20']);

    expect(db.getStorage()).eql(expectedStorage);
    Object.keys(expectedContent).forEach(x => {
      const expected = expectedContent[x];
      const actual = fs.readFileSync(`tmp/www/webapp/${x}/index.html`).toString().trim();
      expect(actual).equal(expected);
    });
  });

  it('should deploy multiple instances (update)', async () => {
    const expectedStorage = {
      webapp: [
        'feature/feature-10',
        'feature/feature-20'
      ]
    };
    const expectedContent = {
      'feature-feature-10': '<h1>feature/feature-10</h1>',
      'feature-feature-20': '<h1>feature/feature-20</h1>',
    };

    await seeds();

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20']);

    expect(db.getStorage()).eql(expectedStorage);
    Object.keys(expectedContent).forEach(x => {
      const expected = expectedContent[x];
      const actual = fs.readFileSync(`tmp/www/webapp/${x}/index.html`).toString().trim();
      expect(actual).equal(expected);
    });
  });

  it('should delete multiple instances', async () => {
    await seeds();

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20'], {delete: true});

    expect(db.getStorage()).eql({});
    ['feature-feature-10', 'feature-feature-20'].forEach(x => {
      const actual = fs.existsSync(`tmp/www/webapp/${x}/index.html`);
      expect(actual).equal(false);
    });
  });

  it('should start multiple instances', async () => {
    await seeds();

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20'], {start: true});

    // TODO: think how to test it
  });

  it('should stop multiple instances', async () => {
    await seeds();

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20'], {stop: true});

    // TODO: think how to test it
  });

  it('should restart multiple instances', async () => {
    await seeds();

    await deployBulk('webapp', ['feature/feature-10', 'feature/feature-20'], {restart: true});

    // TODO: think how to test it
  });
});
