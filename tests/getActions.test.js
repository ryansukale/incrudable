import {expect} from 'chai';

import getActions from '../src/getActions';

describe('getActions', function () {
  it('returns action groups for the given operations', function () {
    const operations = {
      create: '/albums/:id/songs',
      read: '/albums/:id/songs/:song_id',
      update: '/albums/:id/songs/:song_id',
      del: '/abums/:id/:id/songs/:song_id',
      list: '/abums/:id/:id/songs'
    };
    const actions = getActions('albums', operations);
    const subgroups = ['failure', 'success', 'wait'];

    expect(Object.keys(actions)).to.have.members(Object.keys(operations));
    
    expect(Object.keys(actions.create)).to.have.members(subgroups);
    expect(Object.keys(actions.read)).to.have.members(subgroups);
  });
});
