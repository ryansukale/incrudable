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

// const resource = {
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
  describe.only('custom configuration: well known operation names', () => {
    it('invokes the generator with default parameters', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs'
          }
        }
      };

      const actionGroups = getActionGroups(resource, resource.operations);
      const generatorSpy = sinon.spy(() => ({}));
      const tasks = getTasks(generatorSpy, resource, actionGroups);

      expect(generatorSpy.args[0][0]).to.deep.equal({
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url,
        actions: actionGroups.create
      });
    });

    it('invokes the generator with custom actions', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            url: '/albums/:id/songs',
            actions: {wait: noop, success: noop, failure: noop}
          }
        }
      };

      const actionGroups = getActionGroups(resource, resource.operations);
      const generatorSpy = sinon.spy(() => ({}));
      const tasks = getTasks(generatorSpy, resource, actionGroups);

      expect(generatorSpy.args[0][0]).to.deep.equal({
        method: 'post',
        operation: 'create',
        url: resource.operations.create.url,
        actions: resource.operations.create.actions
      });
    });


    it('invokes the generator with custom method', () => {
      const resource = {
        name: 'songs',
        operations: {
          create: {
            method: 'GET',
            url: '/albums/:id/songs'
          }
        }
      };

      const actionGroups = getActionGroups(resource, resource.operations);
      const generatorSpy = sinon.spy(() => ({}));
      const tasks = getTasks(generatorSpy, resource, actionGroups);

      expect(generatorSpy.args[0][0]).to.deep.equal({
        method: 'GET',
        operation: 'create',
        url: resource.operations.create.url,
        actions: actionGroups.create
      });
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
