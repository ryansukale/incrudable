/* global describe, it, beforeEach, afterEach */
import { expect } from 'chai';
import sinon from 'sinon';
import * as fromResource from '../src/fromResource';

import processResources from '../src/processResources';

const resources = {
  albums: {
    name: 'albums',
    operations: {
      create: '/albums',
      read: '/albums/:id'
    }
  },
  songs: {
    name: 'songs',
    operations: {
      create: '/songs/:id/songs',
      read: '/songs/:id/songs/:song_id'
    }
  }
};

describe('processResources', () => {
  const stubs = {};
  beforeEach(() => {
    stubs.fromResource = sinon.stub(fromResource, 'default').returns('test');
  });

  afterEach(() => {
    Object.keys(stubs).forEach(stub => stubs[stub].restore());
  });

  it('generates tasks using a taskGenerator resources', () => {
    const tasks = processResources(() => null, resources, {});
    expect(stubs.fromResource.getCalls().length).to.equal(2);
    expect(tasks).to.deep.equal({
      albums: 'test',
      songs: 'test'
    });
  });
});
