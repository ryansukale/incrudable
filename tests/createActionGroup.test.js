/* global describe, it */
import { expect } from 'chai';

import createActionGroup from '../src/createActionGroup';

describe('createActionGroup', () => {
  it('creates a group of actions based on all input parameters', () => {
    const statusTypes = ['failure', 'success'];
    const options = {
      prefix: 'create',
      base: 'albums',
      statusTypes
    };
    const actionGroup = createActionGroup(options);

    expect(Object.keys(actionGroup)).to.deep.equal(statusTypes);
    statusTypes.map(type => {
      expect(actionGroup[type]).to.be.a('function');
      return undefined;
    });
  });

  it('creates a default group of actions', () => {
    const statusTypes = ['success', 'failure', 'wait'];
    const options = { base: 'albums' };
    const actionGroup = createActionGroup(options);

    expect(Object.keys(actionGroup)).to.have.members(statusTypes);
    statusTypes.map(type => {
      expect(actionGroup[type]).to.be.a('function');
      return undefined;
    });
  });

  it('creates a default group of actions when the parameter is a string', () => {
    const statusTypes = ['success', 'failure', 'wait'];
    const actionGroup = createActionGroup('ALBUMS_CREATED_BY_USER');

    expect(Object.keys(actionGroup)).to.have.members(statusTypes);
    statusTypes.map(type => {
      expect(actionGroup[type]).to.be.a('function');
      return undefined;
    });
  });
});
