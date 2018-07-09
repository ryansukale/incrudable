/* global describe, it */
import { expect } from 'chai';

import incrudable from '../../src/redux-observable';

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
    expect(tasks.epic).to.be.a('function');

    Object.keys(resources).forEach(resource => {
      expect(tasks[resource].epic).to.be.a('function');

      Object.keys(resources[resource].operations).forEach(operation => {
        const opTask = tasks[resource][operation];
        expect(opTask).to.be.a('function');
        expect(opTask.epic).to.be.a('function');
        expect(opTask.success).to.be.a('function');
        expect(opTask.failure).to.be.a('function');
        expect(opTask.wait).to.be.a('function');
      });
    });
  });
});
