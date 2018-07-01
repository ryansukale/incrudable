/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import fromResource from '../../src/redux-thunk/fromResource';
// import createActionGroup from '../../src/createActionGroup';

// const actionNames = ['success', 'failure', 'wait'];
function createMockAjax() {
  return {
    postJSON: sinon.stub().returns(Promise.resolve('test postJSON')),
    getJSON: sinon.stub().returns(Promise.resolve('test getJSON')),
    putJSON: sinon.stub().returns(Promise.resolve('test putJSON')),
    delJSON: sinon.stub().returns(Promise.resolve('test delJSON'))
  };
}

describe('redux-thunk: fromResource', () => {
  const config = {};
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
  beforeEach(() => {
    config.ajax = createMockAjax();
  });

  it('generates a CREATE thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { body: 'hello', params: { id: 10 } };

    return thunks.create(request)(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);
      expect(dispatch.getCall(0).args).to.deep.equal([{
        type: 'CREATE_SONGS_WAIT',
        payload: { request }
      }]);
      expect(dispatch.getCall(1).args).to.deep.equal([{
        type: 'CREATE_SONGS_SUCCESS',
        payload: { request, response: 'test postJSON' }
      }]);

      expect(config.ajax.postJSON.calledOnce);
      expect(config.ajax.postJSON.firstCall.args[0]).to.equal('/albums/10/songs');
    });
  });

  it('generates a READ thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { params: {id: 10, song_id: 20} };

    return thunks.read(request)(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);
      expect(dispatch.getCall(0).args).to.deep.equal([{
        type: 'READ_SONGS_WAIT',
        payload: { request }
      }]);
      expect(dispatch.getCall(1).args).to.deep.equal([{
        type: 'READ_SONGS_SUCCESS',
        payload: { request, response: 'test getJSON' }
      }]);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums/10/songs/20');
    });
  });

  it('generates a UPDATE thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { body: 'hello' };

    return thunks.update(request)(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);
      expect(dispatch.getCall(0).args).to.deep.equal([{
        type: 'UPDATE_SONGS_WAIT',
        payload: { request }
      }]);
      expect(dispatch.getCall(1).args).to.deep.equal([{
        type: 'UPDATE_SONGS_SUCCESS',
        payload: { request, response: 'test putJSON' }
      }]);

      expect(config.ajax.putJSON.calledOnce);
      expect(config.ajax.putJSON.firstCall.args[0]).to.equal(resource.operations.update);
    });
  });

  it('generates a DELETE thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { params: {id: 10, song_id: 20} };

    return thunks.del(request)(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);
      expect(dispatch.getCall(0).args).to.deep.equal([{
        type: 'DEL_SONGS_WAIT',
        payload: { request }
      }]);
      expect(dispatch.getCall(1).args).to.deep.equal([{
        type: 'DEL_SONGS_SUCCESS',
        payload: { request, response: 'test delJSON' }
      }]);

      expect(config.ajax.delJSON.calledOnce);
      expect(config.ajax.delJSON.firstCall.args[0]).to.equal('/albums/10/songs/20');
    });
  });

  it('generates a LIST thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { body: 'hello', params: { id: 10 } };

    return thunks.list(request)(dispatch).then(() => {
      expect(dispatch.calledTwice).to.equal(true);
      expect(dispatch.getCall(0).args).to.deep.equal([{
        type: 'LIST_SONGS_WAIT',
        payload: { request }
      }]);
      expect(dispatch.getCall(1).args).to.deep.equal([{
        type: 'LIST_SONGS_SUCCESS',
        payload: { request, response: 'test getJSON' }
      }]);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums/10/songs');
    });
  });
});

