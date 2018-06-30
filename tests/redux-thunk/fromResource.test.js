/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import fromResource from '../../src/redux-thunk/fromResource';
// import createActionGroup from '../../src/createActionGroup';

// const actionNames = ['success', 'failure', 'wait'];
function createMockAjax() {
  return {
    postJSON: sinon.stub().returns(Promise.resolve('postJSON')),
    getJSON: sinon.stub().returns(Promise.resolve('getJSON')),
    putJSON: sinon.stub().returns(Promise.resolve('putJSON')),
    delJSON: sinon.stub().returns(Promise.resolve('delJSON'))
  };
}

describe.only('redux-thunk: fromResource', () => {
  it('generates CRUD tasks and corresponding actions', () => {
    const config = { ajax: createMockAjax() };

    const resource = {
      name: 'songs',
      operations: {
        create: '/albums/:id/songs',
        read: '/albums/:id/songs/:song_id',
        update: '/albums/:id/songs/:song_id',
        del: '/albums/:id/songs/:song_id',
        list: '/albums/:id/songs'
      }
    };
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();

    return thunks.create({ body: 'hello' })(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.postJSON.calledOnce);
      expect(config.ajax.postJSON.firstCall.args[0]).to.equal(resource.operations.create);
    });
  });
});

