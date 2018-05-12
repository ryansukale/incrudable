import {expect} from 'chai';

import createActionGroup, {DEFAULT_STATUS_TYPES} from '../src/createActionGroup';

describe('createActionGroup', function () {
  it('creates a group of actions based on all input parameters', function () {
    const statusTypes = ['fail', 'success'];
    const options = {
      prefix: 'create',
      base: 'albums',
      statusTypes
    };
    const actionGroup = createActionGroup(options);

    expect(Object.keys(actionGroup)).to.deep.equal(statusTypes);
    expect(actionGroup.fail).to.be.a('function');
    expect(actionGroup.success).to.be.a('function');
  });

  it('creates a default group of actions', function () {
    const statusTypes = ['success', 'fail', 'wait'];
    const options = {base: 'albums'};
    const actionGroup = createActionGroup(options);

    expect(Object.keys(actionGroup)).to.deep.equal(['success', 'fail', 'wait']);
    statusTypes.map((type) => {
      expect(actionGroup[type]).to.be.a('function');
    })
  });
});
