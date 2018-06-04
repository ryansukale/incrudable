/* global describe, it */
import { expect } from 'chai';

import incrudable from '../../src/redux-thunk';

const resources = {
  albums: {
    name: 'albums',
    operations: {
      create: '/albums',
      read: '/albums/:id',
      update: '/albums/:id',
      del: '/albums/:id',
      list: '/albums'
    }
  },
  songs: {
    name: 'songs',
    operations: {
      create: '/albums/:id/songs',
      read: '/albums/:id/songs/:song_id',
      update: '/albums/:id/songs/:song_id',
      del: '/albums/:id/songs/:song_id',
      list: '/albums/:id/songs'
    }
  }
};

describe('incrudable', () => {
  it('create the actions and tasks for resources', () => {
    const tasks = incrudable(resources);

    Object.keys(resources).forEach(resource => {
      Object.keys(resources[resource].operations).forEach(operation => {
        expect(tasks[resource][operation]).to.be.a('function');
        expect(tasks[resource][operation].success).to.be.a('function');
        expect(tasks[resource][operation].failure).to.be.a('function');
        expect(tasks[resource][operation].wait).to.be.a('function');
      });
    });
  });
});
