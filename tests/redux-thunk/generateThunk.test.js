/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import generateThunk, { getThunkCreator } from '../../src/redux-thunk/generateThunk';
import createActionGroup from '../../src/createActionGroup';

function createActions(base) {
  const actions = createActionGroup(base);
  sinon.spy(actions, 'wait');
  sinon.spy(actions, 'success');
  sinon.spy(actions, 'failure');

  return actions;
}

function createMockAjax() {
  return {
    postJSON: sinon.stub().returns(Promise.resolve('postJSON')),
    getJSON: sinon.stub().returns(Promise.resolve('getJSON')),
    putJSON: sinon.stub().returns(Promise.resolve('putJSON')),
    delJSON: sinon.stub().returns(Promise.resolve('delJSON'))
  };
}

describe('generateThunk', () => {
  it('generates thunk for `create` operation that dispatches all the actions', () => {
    const options = {
      operation: 'create',
      actions: createActions('CREATE_ALBUMS'),
      url: '/albums'
    };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({ body: 'hello' });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.postJSON.calledOnce);
      expect(config.ajax.postJSON.firstCall.args[0]).to.equal('/albums');
    });
  });

  it('generates thunk for `read` operation that dispatches all the actions', () => {
    const options = {
      operation: 'read',
      actions: createActions('READ_ALBUMS'),
      url: '/albums/:id'
    };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({ params: { id: '10' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums/10');
    });
  });

  it('generates thunk for `update` operation that dispatches all the actions', () => {
    const options = {
      operation: 'update',
      actions: createActions('UPDATE_ALBUMS'),
      url: '/albums/:id'
    };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({ params: { id: '10' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.putJSON.calledOnce);
      expect(config.ajax.putJSON.firstCall.args[0]).to.equal('/albums/10');
    });
  });

  it('generates thunk for `delete` operation that dispatches all the actions', () => {
    const options = {
      operation: 'del',
      actions: createActions('DEL_ALBUMS'),
      url: '/albums/:id'
    };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({ params: { id: '10' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.delJSON.calledOnce);
      expect(config.ajax.delJSON.firstCall.args[0]).to.equal('/albums/10');
    });
  });

  it('generates thunk for `list` operation that dispatches all the actions', () => {
    const options = {
      operation: 'list',
      actions: createActions('LIST_ALBUMS'),
      url: '/albums'
    };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({ query: { sort: 'age' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums?sort=age');
    });
  });

  it('invokes custom onSuccess', () => {
    const options = {
      operation: 'read',
      actions: createActions('READ_ALBUMS'),
      url: '/albums/:id',
      onSuccess: sinon.spy()
    };
    const request = { params: { id: '10' } };
    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)(request);

    return thunk(dispatch).then(() => {
      expect(options.onSuccess.calledOnce);

      const args = options.onSuccess.firstCall.args;

      expect(args[0]).to.have.all.keys(
        'actions',
        'dispatch',
        'onFailure',
        'done'
      );
      expect(args[1]).to.equal(request);
      expect(args[2]).to.equal('getJSON');
    });
  });

  it('invokes custom onFailure', () => {
    const options = {
      operation: 'read',
      actions: createActions('READ_ALBUMS'),
      url: '/albums/:id',
      onFailure: sinon.spy()
    };
    const request = { params: { id: '10' } };
    const config = {
      ajax: {
        getJSON: sinon.stub().returns(Promise.reject('getJSON'))
      }
    };
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)(request);

    return thunk(dispatch).then(() => {
      expect(options.onFailure.calledOnce);

      const args = options.onFailure.firstCall.args;

      expect(args[0]).to.have.all.keys(
        'actions',
        'dispatch',
        'onFailure',
        'done'
      );
      expect(args[1]).to.equal(request);
      expect(args[2]).to.equal('getJSON');
    });
  });
});

describe('getThunkCreator', () => {
  it('executes a custom beforeSubmit that retuns an action', () => {
    function beforeSubmit(request) {
      return {
        ...request,
        params: {
          id: `prefix_${request.params.id}`
        }
      };
    }

    const options = {
      operation: 'read',
      actions: createActions('READ_ALBUMS'),
      url: '/albums/:id',
      beforeSubmit
    };
    sinon.spy(options, 'beforeSubmit');

    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = getThunkCreator('getJSON', options, config)({ params: { id: '10' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.beforeSubmit.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums/prefix_10');
    });
  });

  it('executes a custom beforeSubmit that returns a Promise', () => {
    function beforeSubmit(request) {
      return Promise.resolve({
        ...request,
        params: {
          id: `prefix_${request.params.id}`
        }
      });
    }

    const options = {
      operation: 'read',
      actions: createActions('READ_ALBUMS'),
      url: '/albums/:id',
      beforeSubmit
    };
    sinon.spy(options, 'beforeSubmit');

    const config = { ajax: createMockAjax() };
    const dispatch = sinon.spy();
    const thunk = getThunkCreator('getJSON', options, config)({ params: { id: '10' } });

    return thunk(dispatch).then(() => {
      expect(options.actions.wait.calledOnce).to.equal(true);
      expect(options.beforeSubmit.calledOnce).to.equal(true);
      expect(options.actions.success.calledOnce).to.equal(true);
      expect(dispatch.calledTwice).to.equal(true);

      expect(config.ajax.getJSON.calledOnce);
      expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/albums/prefix_10');
    });
  });
});
