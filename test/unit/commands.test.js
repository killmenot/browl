'use strict';

const fs = require('fs-extra');
const commands = require('../../lib/commands');
const db = require('../../lib/db');

describe('commands', () => {
  beforeEach(() => {
    db.setStorage({});
  });

  afterEach(() => {
    fs.removeSync('tmp/www');
  });

  describe('#create', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.create();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.create('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is already deployed error', async () => {
      await commands.create('webapp', 'develop');

      try {
        await commands.create('webapp', 'develop');
      } catch (err) {
        expect(err).equal('Branch "develop" of repo "webapp" is already deployed.');
      }
    });

    it('should deploy a new instance', async () => {
      await commands.create('webapp', 'develop');
    });
  });

  describe('#update', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.update();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.update('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.update('webapp', 'master');
      } catch (err) {
        expect(err).equal('Branch "master" of repo "webapp" is not deployed.');
      }
    });

    it('should deploy an existing instance', async () => {
      await commands.create('webapp', 'develop');
      await commands.update('webapp', 'develop');
    });
  });

  describe('#upsertBulk', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.upsertBulk();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branches is missed error', async () => {
      try {
        await commands.upsertBulk('webapp');
      } catch (err) {
        expect(err).equal('branches is missed.');
      }
    });

    it('should deploy multiple instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.upsertBulk('webapp', ['develop', 'master']);
    });
  });

  describe('#delete', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.delete();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.delete('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.delete('webapp', 'master');
      } catch (err) {
        expect(err).equal('Branch "master" of repo "webapp" is not deployed.');
      }
    });

    it('should delete an existing instance', async () => {
      await commands.create('webapp', 'develop');
      await commands.delete('webapp', 'develop');
    });

    it('should delete an existing instance (force)', async () => {
      await commands.delete('webapp', 'develop', true);
    });
  });

  describe('#deleteBulk', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.deleteBulk();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branches is missed error', async () => {
      try {
        await commands.deleteBulk('webapp');
      } catch (err) {
        expect(err).equal('branches is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.deleteBulk('webapp', ['master', 'develop']);
      } catch (err) {
        expect(err).equal('Branches: "master, develop" of repo "webapp" are not deployed.');
      }
    });

    it('should delete multiple instances', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.deleteBulk('webapp', ['develop', 'master']);
    });

    it('should delete multiple instances (force)', async () => {
      await commands.deleteBulk('webapp', ['develop', 'master'], true);
    });
  });

  describe('#deleteAll', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.deleteAll();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return repo is not deployed error', async () => {
      try {
        await commands.deleteAll('webapp');
      } catch (err) {
        expect(err).equal('Repo "webapp" has no deployed instances.');
      }
    });

    it('should delete all repo instances', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.deleteAll('webapp');
    });

    it('should delete all repo instances (force)', async () => {
      await commands.deleteAll('webapp', true);
    });
  });

  describe('#list', () => {
    it('should return no configured instances', async () => {
      const expected = 'No configured instances.';

      const actual = commands.list();

      expect(actual).equal(expected);
    });

    it('should return no configured instances (after delete)', async () => {
      const expected = 'No configured instances.';

      await commands.create('webapp', 'develop');
      await commands.delete('webapp', 'develop');

      const actual = commands.list();

      expect(actual).equal(expected);
    });

    it('should return list of instances', async () => {
      const expected = JSON.stringify({
        webapp: ['develop'],
        'should-sinon': ['master']
      }, null, 2);

      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');

      const actual = commands.list();

      expect(actual).equal(expected);
    });
  });

  describe('#start', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.start();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.start('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.delete('webapp', 'master');
      } catch (err) {
        expect(err).equal('Branch "master" of repo "webapp" is not deployed.');
      }
    });

    it('should start an instance', async () => {
      await commands.create('webapp', 'develop');
      await commands.start('webapp', 'develop');
    });
  });

  describe('#startBulk', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.startBulk();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branches is missed error', async () => {
      try {
        await commands.startBulk('webapp');
      } catch (err) {
        expect(err).equal('branches is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.startBulk('webapp', ['master', 'develop']);
      } catch (err) {
        expect(err).equal('Branches: "master, develop" of repo "webapp" are not deployed.');
      }
    });

    it('should start multiple instances', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.startBulk('webapp', ['develop', 'master']);
    });

    it('should start multiple instances (force)', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.startBulk('webapp', ['develop', 'master'], true);
    });
  });

  describe('#startAll', () => {
    it('should start all instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.startAll();
    });

    it('should start all instances (force)', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.startAll(true);
    });

    it('should start all repo instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.startAll('webapp');
    });

    it('should start all repo instances (force)', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.startAll('webapp', true);
    });
  });

  describe('#stop', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.stop();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.stop('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.delete('webapp', 'master');
      } catch (err) {
        expect(err).equal('Branch "master" of repo "webapp" is not deployed.');
      }
    });

    it('should stop an instance', async () => {
      await commands.create('webapp', 'develop');
      await commands.stop('webapp', 'develop');
    });
  });

  describe('#stopBulk', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.stopBulk();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branches is missed error', async () => {
      try {
        await commands.stopBulk('webapp');
      } catch (err) {
        expect(err).equal('branches is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.stopBulk('webapp', ['master', 'develop']);
      } catch (err) {
        expect(err).equal('Branches: "master, develop" of repo "webapp" are not deployed.');
      }
    });

    it('should stop multiple instances', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.stopBulk('webapp', ['develop', 'master']);
    });
  });

  describe('#stopAll', () => {
    it('should stop all instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.stopAll();
    });

    it('should stop all repo instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.stopAll('webapp');
    });
  });

  describe('#restart', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.restart();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branch is missed error', async () => {
      try {
        await commands.restart('webapp');
      } catch (err) {
        expect(err).equal('branch is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.restart('webapp', 'master');
      } catch (err) {
        expect(err).equal('Branch "master" of repo "webapp" is not deployed.');
      }
    });

    it('should restart an instance', async () => {
      await commands.create('webapp', 'develop');
      await commands.restart('webapp', 'develop');
    });
  });

  describe('#restartBulk', () => {
    it('should return repo is missed error', async () => {
      try {
        await commands.restartBulk();
      } catch (err) {
        expect(err).equal('repo is missed.');
      }
    });

    it('should return branches is missed error', async () => {
      try {
        await commands.restartBulk('webapp');
      } catch (err) {
        expect(err).equal('branches is missed.');
      }
    });

    it('should return branch is not deployed error', async () => {
      try {
        await commands.restartBulk('webapp', ['master', 'develop']);
      } catch (err) {
        expect(err).equal('Branches: "master, develop" of repo "webapp" are not deployed.');
      }
    });

    it('should restart multiple instances', async () => {
      await commands.upsertBulk('webapp', ['develop', 'master']);
      await commands.restartBulk('webapp', ['develop', 'master']);
    });
  });

  describe('#restartAll', () => {
    it('should restart all instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.restartAll();
    });

    it('should restart all repo instances', async () => {
      await commands.create('webapp', 'develop');
      await commands.create('should-sinon', 'master');
      await commands.restartAll('webapp');
    });
  });
});
