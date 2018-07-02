/* global describe, it, beforeEach */
import { expect } from 'chai';
import sinon from 'sinon';
import { of, throwError } from 'rxjs';

import fromResource from '../../src/redux-observable/fromResource';
const errorUtil = message => () => throwError(`error ${message}`);
const successUtil = message => () => of({ message: `test ${message}` });

function createMockSuccessAjax() {
  return {
    postJSON: sinon.spy(successUtil('postJSON')),
    getJSON: sinon.spy(successUtil('getJSON')),
    putJSON: sinon.spy(successUtil('putJSON')),
    delJSON: sinon.spy(successUtil('delJSON'))
  };
}

function createMockFailureAjax() {
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

describe('redux-observable: fromResource', () => {
  beforeEach(() => {
    config.ajax = createMockSuccessAjax();
  });

  function testCustomBeforeSubmit(operation, done) {
    const tasks = fromResource(resource, config);
    const request = { body: 'hello', params: { id: 10, songId: 20 } };
    const customRequest = {body: 'hello', params: {id: 'custom_id', songId: 'custom_songId'}};
    const action$ = of(tasks[operation](request));

    tasks[operation].beforeSubmit = sinon.spy(request => of(customRequest));

    tasks[operation].epic(action$).subscribe(({ payload }) => {
      expect(payload.request).to.deep.equal(customRequest);
      done();
    });
  }

  function testCustomOnFailure(operation, done) {
    const tasks = fromResource(resource, {ajax: createMockFailureAjax()});
    const request = { body: 'hello', params: { id: 10, songId: 20 } };
    const customRequest = {body: 'hello', params: {id: 'custom_id', songId: 'custom_songId'}};
    const action$ = of(tasks[operation](request));

    tasks[operation].onFailure = sinon.spy(({ payload }) => ({
      type: 'CUSTOM_FAILURE',
      payload
    }));
    
    tasks[operation].epic(action$).subscribe(({ payload }) => {
      expect(tasks[operation].onFailure.calledOnce).to.equal(true);
      done();
    });
  }

  function testCustomOnSuccess(operation, done) {
    const tasks = fromResource(resource, config);
    const request = { body: 'hello', params: { id: 10, songId: 20 } };
    const customRequest = {body: 'hello', params: {id: 'custom_id', songId: 'custom_songId'}};
    const action$ = of(tasks[operation](request));

    tasks[operation].onSuccess = sinon.spy(({ payload }) => ({
      type: 'CUSTOM_SUCCESS',
      payload
    }));
    
    tasks[operation].epic(action$).subscribe(({ payload }) => {
      expect(tasks[operation].onSuccess.calledOnce).to.equal(true);
      done();
    });
  }

  describe('create operation', done => {
    it('generates a CREATE epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { body: 'hello', params: { id: 10 } };
      const action$ = of(tasks.create(request));

      tasks.create.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test postJSON' }
        });
        expect(config.ajax.postJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('create', done);
    });

    it('allows a custom onFailure', done => {
      testCustomOnFailure('create', done);
    });

    it('allows a custom onSuccess', done => {
      testCustomOnSuccess('create', done);
    });
  });

  describe('read operation', done => {
    it('generates a READ epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10, songId: 20 } };
      const action$ = of(tasks.create(request));

      tasks.read.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test getJSON' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('read', done);
    });

    it('allows a custom onFailure', done => {
      testCustomOnFailure('read', done);
    });

    it('allows a custom onSuccess', done => {
      testCustomOnSuccess('read', done);
    });
  });

  describe('update operation', done => {
    it('generates a UPDATE epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { body: 'hello', params: { id: 10, songId: 20 } };
      const action$ = of(tasks.create(request));

      tasks.update.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test putJSON' }
        });
        expect(config.ajax.putJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('update', done);
    });

    it('allows a custom onFailure', done => {
      testCustomOnFailure('update', done);
    });

    it('allows a custom onSuccess', done => {
      testCustomOnSuccess('update', done);
    });
  });

  describe('del operation', done => {
    it('generates a DEL epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10, songId: 20 } };
      const action$ = of(tasks.create(request));

      tasks.del.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test delJSON' }
        });
        expect(config.ajax.delJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });

      it('allows a custom beforeSubmit', done => {
        testCustomBeforeSubmit('del', done);
      });

      it('allows a custom onFailure', done => {
        testCustomOnFailure('del', done);
      });

      it('allows a custom onSuccess', done => {
        testCustomOnSuccess('del', done);
      });
    });
  });

  describe('del operation', done => {
    it('generates a LIST epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10 } };
      const action$ = of(tasks.create(request));

      tasks.list.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test getJSON' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('list', done);
    });

    it('allows a custom onFailure', done => {
      testCustomOnFailure('list', done);
    });

    it('allows a custom onSuccess', done => {
      testCustomOnSuccess('list', done);
    });
  });
});
