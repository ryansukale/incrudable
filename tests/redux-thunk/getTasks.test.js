import {expect} from 'chai';
import sinon from 'sinon';

import getTasks from '../../src/redux-thunk/getTasks';
import getActions from '../../src/getActions';

const resources = {
  albums: {
    name: 'albums',
    operations: {
      create: '/albums/:id/songs',
      read: '/albums/:id/songs/:song_id'
    }
  }
};

describe('getTasks', function () {
  it('generates tasks for the resources', function () {
    const {albums} = resources;

    const actionGroups = getActions(albums, albums.operations);
    const tasks = getTasks(albums, actionGroups);

    expect(tasks.create).to.be.a('function');
    expect(tasks.create.success).to.equal(actionGroups.create.success);
    expect(tasks.create.failure).to.equal(actionGroups.create.failure);
    expect(tasks.create.wait).to.equal(actionGroups.create.wait);
    
    expect(tasks.read).to.be.a('function');
    expect(tasks.read.success).to.equal(actionGroups.read.success);
    expect(tasks.read.failure).to.equal(actionGroups.read.failure);
    expect(tasks.read.wait).to.equal(actionGroups.read.wait);
  });
});
