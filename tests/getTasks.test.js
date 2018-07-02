/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import getTasks from '../src/getTasks';
import getActionGroups from '../src/getActionGroups';

const resources = {
  songs: {
    name: 'songs',
    operations: {
      create: '/songs/:id/songs',
      read: '/songs/:id/songs/:song_id'
    }
  }
};

describe('getTasks', () => {
  it('generates tasks using a taskGenerator resources', () => {
    const { songs } = resources;
    const mockGenerator = () => () => {};
    const generatorSpy = sinon.spy(mockGenerator);

    const actionGroups = getActionGroups(songs, songs.operations);
    const tasks = getTasks(generatorSpy, songs, actionGroups);

    expect(tasks.create).to.be.a('function');
    expect(tasks.create.success).to.equal(actionGroups.create.success);
    expect(tasks.create.failure).to.equal(actionGroups.create.failure);
    expect(tasks.create.wait).to.equal(actionGroups.create.wait);

    expect(tasks.read).to.be.a('function');
    expect(tasks.read.success).to.equal(actionGroups.read.success);
    expect(tasks.read.failure).to.equal(actionGroups.read.failure);
    expect(tasks.read.wait).to.equal(actionGroups.read.wait);

    expect(generatorSpy.getCalls().length).to.equal(2);
  });
});
