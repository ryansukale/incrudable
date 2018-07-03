/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import getTasks from '../src/getTasks';
import getActionGroups from '../src/getActionGroups';
import generateThunk from '../src/redux-thunk/generateThunk';
import generateEpic from '../src/redux-observable/generateEpic';

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

function assertTaskInterface(tasks, resource, actionGroups) {
  Object.keys(resource.operations).map(opName => {
    expect(tasks[opName]).to.be.a('function');
    expect(tasks[opName].success).to.equal(actionGroups[opName].success);
    expect(tasks[opName].failure).to.equal(actionGroups[opName].failure);
    expect(tasks[opName].wait).to.equal(actionGroups[opName].wait);
  });
}

describe('getTasks', () => {
  describe('redux-thunk tasks', () => {
    it('creates tasks based on generateThunk', () => {
      const { songs } = resources;

      const actionGroups = getActionGroups(songs, songs.operations);
      const tasks = getTasks(generateThunk, songs, actionGroups);

      assertTaskInterface(tasks, songs, actionGroups);
    });
  });
});
