/* global describe, it, beforeEach */
import { expect } from 'chai';
import sinon from 'sinon';

import fromResource from '../../src/redux-thunk/fromResource';
// const errorUtil = message => () => throw Error(`error ${message}`);
const successUtil = message => () => Promise.resolve(`test ${message}`);

function createMockSuccessAjax() {
  return {
    postJSON: sinon.spy(successUtil('postJSON')),
    getJSON: sinon.spy(successUtil('getJSON')),
    putJSON: sinon.spy(successUtil('putJSON')),
    delJSON: sinon.spy(successUtil('delJSON'))
  };
}

const config = {};
const resource = {
  name: 'songs',
  operations: {
    create: '/albums/:id/songs',
    read: '/albums/:id/songs/:songId',
    update: '/albums/:id/songs/:songId',
    del: '/albums/:id/songs/:songId',
    list: '/albums/:id/songs'
  }
};

describe('redux-thunk: fromResource', () => {
  beforeEach(() => {
    config.ajax = createMockSuccessAjax();
  });

  describe('"create" operation', () => {
    it('generates a CREATE thunk for a resource with actions', () => {
      const thunks = fromResource(resource, config);
      const dispatch = sinon.spy();
      const request = { body: 'hello', params: { id: 10 } };

      return thunks
        .create(request)(dispatch)
        .then(() => {
          expect(dispatch.calledTwice).to.equal(true);
          expect(dispatch.getCall(0).args).to.deep.equal([
            {
              type: 'CREATE_SONGS_WAIT',
              payload: request
            }
          ]);
          expect(dispatch.getCall(1).args).to.deep.equal([
            {
              type: 'CREATE_SONGS_SUCCESS',
              payload: { request, response: 'test postJSON' }
            }
          ]);

          expect(config.ajax.postJSON.calledOnce);
          expect(config.ajax.postJSON.firstCall.args[0]).to.equal(
            '/albums/10/songs'
          );
        });
    });
  });

  it('generates a READ thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { params: { id: 10, songId: 20 } };

    return thunks
      .read(request)(dispatch)
      .then(() => {
        expect(dispatch.calledTwice).to.equal(true);
        expect(dispatch.getCall(0).args).to.deep.equal([
          {
            type: 'READ_SONGS_WAIT',
            payload: request
          }
        ]);
        expect(dispatch.getCall(1).args).to.deep.equal([
          {
            type: 'READ_SONGS_SUCCESS',
            payload: { request, response: 'test getJSON' }
          }
        ]);

        expect(config.ajax.getJSON.calledOnce);
        expect(config.ajax.getJSON.firstCall.args[0]).to.equal(
          '/albums/10/songs/20'
        );
      });
  });

  it('generates a UPDATE thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { body: 'hello' };

    return thunks
      .update(request)(dispatch)
      .then(() => {
        expect(dispatch.calledTwice).to.equal(true);
        expect(dispatch.getCall(0).args).to.deep.equal([
          {
            type: 'UPDATE_SONGS_WAIT',
            payload: request
          }
        ]);
        expect(dispatch.getCall(1).args).to.deep.equal([
          {
            type: 'UPDATE_SONGS_SUCCESS',
            payload: { request, response: 'test putJSON' }
          }
        ]);

        expect(config.ajax.putJSON.calledOnce);
        expect(config.ajax.putJSON.firstCall.args[0]).to.equal(
          resource.operations.update
        );
      });
  });

  it('generates a DELETE thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { params: { id: 10, songId: 20 } };

    return thunks
      .del(request)(dispatch)
      .then(() => {
        expect(dispatch.calledTwice).to.equal(true);
        expect(dispatch.getCall(0).args).to.deep.equal([
          {
            type: 'DEL_SONGS_WAIT',
            payload: request
          }
        ]);
        expect(dispatch.getCall(1).args).to.deep.equal([
          {
            type: 'DEL_SONGS_SUCCESS',
            payload: { request, response: 'test delJSON' }
          }
        ]);

        expect(config.ajax.delJSON.calledOnce);
        expect(config.ajax.delJSON.firstCall.args[0]).to.equal(
          '/albums/10/songs/20'
        );
      });
  });

  it('generates a LIST thunk for a resource with actions', () => {
    const thunks = fromResource(resource, config);
    const dispatch = sinon.spy();
    const request = { body: 'hello', params: { id: 10 } };

    return thunks
      .list(request)(dispatch)
      .then(() => {
        expect(dispatch.calledTwice).to.equal(true);
        expect(dispatch.getCall(0).args).to.deep.equal([
          {
            type: 'LIST_SONGS_WAIT',
            payload: request
          }
        ]);
        expect(dispatch.getCall(1).args).to.deep.equal([
          {
            type: 'LIST_SONGS_SUCCESS',
            payload: { request, response: 'test getJSON' }
          }
        ]);

        expect(config.ajax.getJSON.calledOnce);
        expect(config.ajax.getJSON.firstCall.args[0]).to.equal(
          '/albums/10/songs'
        );
      });
  });
});
