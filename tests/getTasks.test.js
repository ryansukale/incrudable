/* global describe, it */
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import sinon from 'sinon';

import getTasks from '../src/getTasks';
import getActionGroups from '../src/getActionGroups';
import generateThunk from '../src/redux-thunk/generateThunk';
import generateEpic from '../src/redux-observable/generateEpic';

chai.use(chaiSubset);
const noop = () => null;

const resources = {
  songs: {
    name: 'songs',
    operations: {
      create: '/albums/:id/songs',
      read: '/albums/:id/songs/:songId',
      update: '/albums/:id/songs/:songId',
      del: '/albums/:id/songs/:songId',
      list: '/albums/:id/songs',
      filteredList: {
        method: 'GET',
        url: '/albums/:id/songs'
      }
    }
  }
};

describe('getTasks', () => {
  const defaultActionGroups = {
    create: {
      wait: () => 'wait',
      success: () => 'success',
      failure: () => 'failure'
    }
  };

  function verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs) {
    const generatorSpy = sinon.spy(() => ({}));
    getTasks(generatorSpy, resource, defaultActionGroups);

    expect(generatorSpy.args[0][0]).to.deep.equal(expectedArgs);
  }

  describe('custom configuration for a standard operation name', () => {
    it('invokes the generator with default parameters', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs'
          }
        }
      };

      const expectedArgs = {
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url,
        actions: defaultActionGroups.create
      };

      const generatorSpy = sinon.spy(() => ({}));
      getTasks(generatorSpy, resource, defaultActionGroups);

      verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs);
    });

    it('invokes the generator with custom http method', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            method: 'GET',
            url: '/albums/:id/songs'
          }
        }
      };

      const expectedArgs = {
        method: 'GET',
        operation: 'create',
        url: resource.operations.create.url,
        actions: defaultActionGroups.create
      };

      verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs);
    });

    it('invokes the generator with custom actions', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs',
            actions: { wait: noop, success: noop, failure: noop }
          }
        }
      };

      const expectedArgs = {
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url,
        actions: resource.operations.create.actions
      };

      verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs);
    });

    it('invokes the generator with custom actionTypes', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs',
            actionTypes: {
              wait: 'CUSTOM_WAIT',
              success: 'CUSTOM_SUCCESS',
              failure: 'CUSTOM_FAILURE'
            }
          }
        }
      };

      const expectedArgs = {
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url
      };

      const generatorSpy = sinon.spy(() => ({}));
      getTasks(generatorSpy, resource, defaultActionGroups);

      const args = generatorSpy.args[0][0];
      console.log(args);

      expect(args).to.containSubset(expectedArgs);

      expect(args.actions.wait.toString()).to.equal(
        resource.operations.create.actionTypes.wait
      );
      expect(args.actions.success.toString()).to.equal(
        resource.operations.create.actionTypes.success
      );
      expect(args.actions.failure.toString()).to.equal(
        resource.operations.create.actionTypes.failure
      );
    });

    it('invokes the generator with custom onSuccess, onFailure and beforeSubmit handlers', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs',
            onSuccess: () => 'onSuccess',
            onFailure: () => 'onFailure',
            beforeSubmit: () => 'beforeSubmit'
          }
        }
      };

      const expectedArgs = {
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url,
        actions: defaultActionGroups.create,
        onSuccess: resource.operations.create.onSuccess,
        onFailure: resource.operations.create.onFailure,
        beforeSubmit: resource.operations.create.beforeSubmit
      };

      verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs);
    });
  });

  describe('configuration for a custom operation name', () => {
    it('uses custom params for a non standard operation name', () => {
      const filterSongs = {
        method: 'GET',
        url: '/albums/:id/songs',
        actions: { wait: noop, success: noop, failure: noop },
        onSuccess: () => 'onSuccess',
        onFailure: () => 'onFailure',
        beforeSubmit: () => 'beforeSubmit'
      };

      const resource = {
        name: 'songs',
        operations: { filterSongs }
      };

      const expectedArgs = {
        method: filterSongs.method,
        operation: 'filterSongs',
        url: filterSongs.url,
        actions: filterSongs.actions,
        onSuccess: filterSongs.onSuccess,
        onFailure: filterSongs.onFailure,
        beforeSubmit: filterSongs.beforeSubmit
      };

      verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs);
    });
  });

  describe('task interface', () => {
    it('creates tasks based on generateThunk', () => {
      const { songs } = resources;
      const generatorSpy = sinon.spy(generateThunk);

      const actionGroups = getActionGroups(songs, songs.operations);
      const tasks = getTasks(generatorSpy, songs, actionGroups);

      Object.keys(songs.operations).map(opName => {
        expect(tasks[opName]).to.be.a('function');
        expect(tasks[opName].success).to.equal(actionGroups[opName].success);
        expect(tasks[opName].failure).to.equal(actionGroups[opName].failure);
        expect(tasks[opName].wait).to.equal(actionGroups[opName].wait);
        return undefined;
      });
    });

    it('creates tasks based on generateEpic', () => {
      const { songs } = resources;
      const generatorSpy = sinon.spy(generateEpic);

      const actionGroups = getActionGroups(songs, songs.operations);
      const tasks = getTasks(generatorSpy, songs, actionGroups);

      Object.keys(songs.operations).map(opName => {
        expect(tasks[opName]).to.be.a('function');
        expect(tasks[opName].epic).to.be.a('function');
        expect(tasks[opName].success).to.equal(actionGroups[opName].success);
        expect(tasks[opName].failure).to.equal(actionGroups[opName].failure);
        expect(tasks[opName].wait).to.equal(actionGroups[opName].wait);
        return undefined;
      });
    });
  });
});
