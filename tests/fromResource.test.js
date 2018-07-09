/* global describe, it, beforeEach, afterEach */
import { expect } from 'chai';
import sinon from 'sinon';
import * as getActionGroups from '../src/getActionGroups';
import * as getTasks from '../src/getTasks';

import fromResource from '../src/fromResource';

const noop = () => null;
const resource = {
  name: 'songs',
  operations: {
    create: '/songs/:id/songs',
    read: '/songs/:id/songs/:song_id'
  }
};

describe('fromResource', () => {
  const stubs = {};
  beforeEach(() => {
    stubs.getActionGroups = sinon
      .stub(getActionGroups, 'default')
      .returns('getActionGroups');
    stubs.getTasks = sinon.stub(getTasks, 'default').returns('getTasks');
  });

  afterEach(() => {
    Object.keys(stubs).forEach(stub => stubs[stub].restore());
  });

  it('generates tasks using a taskGenerator resources', () => {
    const config = {};
    const tasks = fromResource(noop, resource, config);

    expect(tasks).to.deep.equal('getTasks');
    expect(stubs.getTasks.args[0]).to.have.members([
      noop,
      resource,
      'getActionGroups',
      config
    ]);
  });
});
