/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import getTasks from '../src/getTasks';
import getActionGroups from '../src/getActionGroups';
import generateThunk from '../src/redux-thunk/generateThunk';

// Testing utils
import createActionSpies from './support/createActionSpies';

const noop = () => null;

// Import generateEpic from '../src/redux-observable/generateEpic';

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

// Const resource = {
//   name: 'songs',
//   operations: {
//     create: {
//       url: '/albums/:id/songs'
//     },
//     read: {
//       url: '/albums/:id/songs/:songId'
//     },
//     update: {
//       url: '/albums/:id/songs/:songId'
//     },
//     del: {
//       url: '/albums/:id/songs/:songId'
//     },
//     list: {
//       url: '/albums/:id/songs'
//     }
//   }
// };

function assertThunkInterface(tasks, opName, actionGroups) {
  expect(tasks[opName]).to.be.a('function');
  expect(tasks[opName].success).to.equal(actionGroups[opName].success);
  expect(tasks[opName].failure).to.equal(actionGroups[opName].failure);
  expect(tasks[opName].wait).to.equal(actionGroups[opName].wait);
}

describe('getTasks', () => {
  function verifyGeneratorArgs(resource, defaultActionGroups, expectedArgs) {
    const generatorSpy = sinon.spy(() => ({}));
    getTasks(generatorSpy, resource, defaultActionGroups);

    expect(generatorSpy.args[0][0]).to.deep.equal(expectedArgs);
  }

  describe('custom configuration for a well known operation name', () => {
    const defaultActionGroups = {
      create: {
        wait: () => 'wait',
        success: () => 'success',
        failure: () => 'failure'
      }
    };

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

  describe('redux-thunk tasks', () => {
    it('creates tasks based on generateThunk', () => {
      const { songs } = resources;
      const generatorSpy = sinon.spy(generateThunk);

      const actionGroups = getActionGroups(songs, songs.operations);
      const tasks = getTasks(generatorSpy, songs, actionGroups);

      Object.keys(songs.operations).map(opName =>
        assertThunkInterface(tasks, opName, actionGroups)
      );
    });

    it('invokes generateThunk with the custom actions', () => {
      const resource = {
        name: 'songs',
        operations: {
          filteredList: {
            method: 'GET',
            url: '/albums/:id/songs',
            actions: createActionSpies('FILTERED_SONGS')
          }
        }
      };
      const generatorSpy = sinon.spy(generateThunk);
      const tasks = getTasks(generatorSpy, resource, {});
      const actionGroups = {
        filteredList: resource.operations.filteredList.actions
      };

      assertThunkInterface(tasks, 'filteredList', actionGroups);
      expect(generatorSpy.args[0][0]).to.deep.equal({
        operation: 'filteredList',
        ...resource.operations.filteredList
      });
    });
  });
});
