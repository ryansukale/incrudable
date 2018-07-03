/* global describe, it, beforeEach */
import { expect } from 'chai';
import sinon from 'sinon';

import fromResource from '../../src/redux-thunk/fromResource';

const errorUtil = message => () => Promise.reject(`error ${message}`);
const successUtil = message => () => Promise.resolve(`test ${message}`);

function createSpySuccessAjax() {
  return {
    postJSON: sinon.spy(successUtil('postJSON')),
    getJSON: sinon.spy(successUtil('getJSON')),
    putJSON: sinon.spy(successUtil('putJSON')),
    delJSON: sinon.spy(successUtil('delJSON'))
  };
}

function createSpyFailureAjax() {
  return {
    postJSON: sinon.spy(errorUtil('postJSON')),
    getJSON: sinon.spy(errorUtil('getJSON')),
    putJSON: sinon.spy(errorUtil('putJSON')),
    delJSON: sinon.spy(errorUtil('delJSON'))
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

function testCustomBeforeSubmit(operation) {
  const tasks = fromResource(resource, config);
  const request = { body: 'hello', params: { id: 10, songId: 20 } };
  const customRequest = {
    body: 'hello',
    params: { id: 'custom_id', songId: 'custom_songId' }
  };
  const dispatch = sinon.spy();

  tasks[operation].beforeSubmit = sinon.spy(() => customRequest);

  return tasks[operation](request)(dispatch).then(() => {
    expect(tasks[operation].beforeSubmit.calledOnce).to.equal(true);
  });
}

function testCustomOnFailure(operation) {
  const tasks = fromResource(resource, { ajax: createSpyFailureAjax() });
  const request = { body: 'hello', params: { id: 10, songId: 20 } };
  const dispatch = sinon.spy();

  tasks[operation].onFailure = sinon.spy();

  return tasks[operation](request)(dispatch).then(() => {
    expect(tasks[operation].onFailure.calledOnce).to.equal(true);
  });
}

function testCustomOnSuccess(operation) {
  const tasks = fromResource(resource, config);
  const request = { body: 'hello', params: { id: 10, songId: 20 } };
  const dispatch = sinon.spy();

  tasks[operation].onSuccess = sinon.spy();

  return tasks[operation](request)(dispatch).then(() => {
    expect(tasks[operation].onSuccess.calledOnce).to.equal(true);
  });
}

describe('fromResource: redux-thunk', () => {
  beforeEach(() => {
    config.ajax = createSpySuccessAjax();
  });

  describe('create operation', () => {
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

    it('allows a custom beforeSubmit', () => {
      return testCustomBeforeSubmit('create');
    });

    it('allows a custom onFailure', () => {
      return testCustomOnFailure('create');
    });

    it('allows a custom onSuccess', () => {
      return testCustomOnSuccess('create');
    });
  });

  describe('read operation', () => {
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

    it('allows a custom beforeSubmit', () => {
      return testCustomBeforeSubmit('read');
    });

    it('allows a custom onFailure', () => {
      return testCustomOnFailure('read');
    });

    it('allows a custom onSuccess', () => {
      return testCustomOnSuccess('read');
    });
  });

  describe('update operation', () => {
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

    it('allows a custom beforeSubmit', () => {
      return testCustomBeforeSubmit('update');
    });

    it('allows a custom onFailure', () => {
      return testCustomOnFailure('update');
    });

    it('allows a custom onSuccess', () => {
      return testCustomOnSuccess('update');
    });
  });

  describe('del operation', () => {
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

    it('allows a custom beforeSubmit', () => {
      return testCustomBeforeSubmit('del');
    });

    it('allows a custom onFailure', () => {
      return testCustomOnFailure('del');
    });

    it('allows a custom onSuccess', () => {
      return testCustomOnSuccess('del');
    });
  });

  describe('list operation', () => {
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

    it('allows a custom beforeSubmit', () => {
      return testCustomBeforeSubmit('list');
    });

    it('allows a custom onFailure', () => {
      return testCustomOnFailure('list');
    });

    it('allows a custom onSuccess', () => {
      return testCustomOnSuccess('list');
    });
  });
});
