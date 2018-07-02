/* global describe, it, beforeEach */
import { expect } from 'chai';
import sinon from 'sinon';
import { of } from 'rxjs';

import fromResource from '../../src/redux-observable/fromResource';

function createMockAjax() {
  return {
    postJSON: sinon
      .stub()
      .returns(Promise.resolve({ message: 'test postJSON ' })),
    getJSON: sinon
      .stub()
      .returns(Promise.resolve({ message: 'test getJSON ' })),
    putJSON: sinon
      .stub()
      .returns(Promise.resolve({ message: 'test putJSON ' })),
    delJSON: sinon.stub().returns(Promise.resolve({ message: 'test delJSON ' }))
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
    config.ajax = createMockAjax();
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

  describe('create operation', done => {
    it('generates a CREATE epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { body: 'hello', params: { id: 10 } };
      const action$ = of(tasks.create(request));

      tasks.create.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test postJSON ' }
        });
        expect(config.ajax.postJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('create', done);
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
          response: { message: 'test getJSON ' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('read', done);
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
          response: { message: 'test putJSON ' }
        });
        expect(config.ajax.putJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('update', done);
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
          response: { message: 'test delJSON ' }
        });
        expect(config.ajax.delJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });

      it('allows a custom beforeSubmit', done => {
        testCustomBeforeSubmit('del', done);
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
          response: { message: 'test getJSON ' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });

    it('allows a custom beforeSubmit', done => {
      testCustomBeforeSubmit('list', done);
    });
  });
});
