/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import getTasks from '../src/getTasks';
import getActionGroups from '../src/getActionGroups';
import generateThunk from '../src/redux-thunk/generateThunk';

// Testing utils
import createActionSpies from './support/createActionSpies';

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

function assertThunkInterface(tasks, resource, actionGroups) {
  Object.keys(resource.operations).map(opName => {
    expect(tasks[opName]).to.be.a('function');
    expect(tasks[opName].success).to.equal(actionGroups[opName].success);
    expect(tasks[opName].failure).to.equal(actionGroups[opName].failure);
    expect(tasks[opName].wait).to.equal(actionGroups[opName].wait);
    return undefined;
  });
}

describe('getTasks', () => {
  describe('redux-thunk tasks', () => {
    it('creates tasks based on generateThunk', () => {
      const { songs } = resources;
      const generatorSpy = sinon.spy(generateThunk);

      const actionGroups = getActionGroups(songs, songs.operations);
      const tasks = getTasks(generatorSpy, songs, actionGroups);

      assertThunkInterface(tasks, songs, actionGroups);
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
      const generatorSpy = sinon.spy(generateThunk); //sinon.spy((...args) => generateThunk(...args));
      const tasks = getTasks(generatorSpy, resource, {});

      expect(generatorSpy.args[0][0]).to.deep.equal({
        operation: 'filteredList',
        ...resource.operations.filteredList
      });
    });
  });
});
