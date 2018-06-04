/* global describe, it */
import { expect } from 'chai';

import getActions from '../src/getActions';

const operations = {
  create: '/albums/:id/songs',
  read: '/albums/:id/songs/:song_id'
};

describe('getActions', () => {
  it('returns action groups for the given operations', () => {
    const actions = getActions('albums', operations);
    const subgroups = ['failure', 'success', 'wait'];

    const actionGroupNames = Object.keys(actions);
    const operationNames = Object.keys(operations);

    expect(actionGroupNames.length).to.equal(operationNames.length);
    expect(actionGroupNames).to.have.members(operationNames);

    expect(Object.keys(actions.create)).to.have.members(subgroups);
    expect(Object.keys(actions.read)).to.have.members(subgroups);
  });
});
