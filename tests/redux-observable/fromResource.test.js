/* global describe, it, beforeEach */
import { expect } from 'chai';
import sinon from 'sinon';
import { of } from 'rxjs';

import fromResource from '../../src/redux-observable/fromResource';

const successUtil = message => () => of({ message: `test ${message}` });

function createSpySuccessAjax() {
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

describe('fromResource: redux-observable', () => {
  beforeEach(() => {
    config.ajax = createSpySuccessAjax();
  });

  describe('create operation', () => {
    it('generates a CREATE epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { body: 'hello', params: { id: 10 } };
      const action$ = of(tasks.create(request));

      tasks.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test postJSON' }
        });
        expect(config.ajax.postJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });
  });

  describe('read operation', () => {
    it('generates a READ epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10, songId: 20 } };
      const action$ = of(tasks.read(request));

      tasks.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test getJSON' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });
  });

  describe('update operation', () => {
    it('generates a UPDATE epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { body: 'hello', params: { id: 10, songId: 20 } };
      const action$ = of(tasks.update(request));

      tasks.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test putJSON' }
        });
        expect(config.ajax.putJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });
  });

  describe('del operation', () => {
    it('generates a DEL epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10, songId: 20 } };
      const action$ = of(tasks.del(request));

      tasks.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test delJSON' }
        });
        expect(config.ajax.delJSON.args[0][0]).to.equal('/albums/10/songs/20');
        done();
      });
    });
  });

  describe('list operation', () => {
    it('generates a LIST epic for a resource with actions', done => {
      const tasks = fromResource(resource, config);
      const request = { params: { id: 10 } };
      const action$ = of(tasks.list(request));

      tasks.epic(action$).subscribe(({ payload }) => {
        expect(payload).to.deep.equal({
          request,
          response: { message: 'test getJSON' }
        });
        expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs');
        done();
      });
    });
  });

  // it('creates an root epic for all the operations', done => {
  //   const tasks = fromResource(resource, config);
  //   const request = { params: { id: 10 } };
  //   const action$ = of(tasks.create(request));

  //   tasks.list.epic(action$).subscribe(({ payload }) => {
  //     expect(payload).to.deep.equal({
  //       request,
  //       response: { message: 'test getJSON' }
  //     });
  //     expect(config.ajax.getJSON.args[0][0]).to.equal('/albums/10/songs');
  //     done();
  //   });
  // });
});
