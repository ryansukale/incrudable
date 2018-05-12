import {expect} from 'chai';

import getActions from '../src/getActions';

describe('getActions', function () {
  it('returns action groups for the given operations', function () {
    const operations = ['create', 'read'];
    const actions = getActions('albums', operations);
    const subgroups = ['fail', 'success', 'wait'];

    expect(Object.keys(actions)).to.have.members(operations);
    
    expect(Object.keys(actions.create)).to.have.members(subgroups);
    expect(Object.keys(actions.read)).to.have.members(subgroups);
  });
});
