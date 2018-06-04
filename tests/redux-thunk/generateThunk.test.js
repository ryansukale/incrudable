import {expect} from 'chai';
import sinon from 'sinon';

import generateThunk from '../../src/redux-thunk/generateThunk';

function createMockActions() {
  return ['wait', 'success', 'fail'].reduce((acc, type) => {
    acc[type] = sinon.stub().returns(type) // () => {console.log(type); sinon.stub().returns(type)();}
    return acc;
  }, {});
}

function createMockAjax() {
  return {
    postJSON: sinon.stub().returns(Promise.resolve('postJSON')),
    getJSON: sinon.stub().returns(Promise.resolve('getJSON')),
    putJSON: sinon.stub().returns(Promise.resolve('putJSON')),
    delJSON: sinon.stub().returns(Promise.resolve('delJSON'))
  };
}

describe('generateThunk', function () {
  it('generates thunk for `create` operation that dispatches all the actions', function () {
    const options = {
      operation: 'create',
      actions: createMockActions(),
      url: '/users'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({body: 'hello'});

    return thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        expect(config.ajax.postJSON.calledOnce);
        expect(config.ajax.postJSON.firstCall.args[0]).to.equal('/users');
      });
  });

  it('generates thunk for `read` operation that dispatches all the actions', function () {
    const options = {
      operation: 'read',
      actions: createMockActions(),
      url: '/users/:id'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({params: {id: '10'}});

    return thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        expect(config.ajax.getJSON.calledOnce);
        expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/users/10');
      });
  });

  it('generates thunk for `update` operation that dispatches all the actions', function () {
    const options = {
      operation: 'update',
      actions: createMockActions(),
      url: '/users/:id'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({params: {id: '10'}});

    return thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        expect(config.ajax.putJSON.calledOnce);
        expect(config.ajax.putJSON.firstCall.args[0]).to.equal('/users/10');
      });
  });

  it('generates thunk for `delete` operation that dispatches all the actions', function () {
    const options = {
      operation: 'del',
      actions: createMockActions(),
      url: '/users/:id'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({params: {id: '10'}});

    return thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        expect(config.ajax.delJSON.calledOnce);
        expect(config.ajax.delJSON.firstCall.args[0]).to.equal('/users/10');
      });
  });

  it('generates thunk for `list` operation that dispatches all the actions', function () {
    const options = {
      operation: 'list',
      actions: createMockActions(),
      url: '/users'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)({query: {sort_by: 'age'}});

    return thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        expect(config.ajax.getJSON.calledOnce);
        expect(config.ajax.getJSON.firstCall.args[0]).to.equal('/users?sort_by=age');
      });
  });

  it('invokes custom onSuccess', function () {
    const options = {
      operation: 'read',
      actions: createMockActions(),
      url: '/users/:id',
      onSuccess: sinon.spy()
    };
    const request = {params: {id: '10'}};
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)(request);

    return thunk(dispatch)
      .then(() => {
        expect(options.onSuccess.calledOnce);
        
        const args = options.onSuccess.firstCall.args;

        expect(args[0]).to.have.all.keys('actions', 'dispatch', 'onFailure', 'done');
        expect(args[1]).to.equal(request);
        expect(args[2]).to.equal('getJSON');
      });
  });

  it('invokes custom onFailure', function () {
    const options = {
      operation: 'read',
      actions: createMockActions(),
      url: '/users/:id',
      onFailure: sinon.spy()
    };
    const request = {params: {id: '10'}};
    const config = {ajax: {
      getJSON: sinon.stub().returns(Promise.reject('getJSON')),
    }};
    const dispatch = sinon.spy();
    const thunk = generateThunk(options, config)(request);

    return thunk(dispatch)
      .then(() => {
        expect(options.onFailure.calledOnce);
        
        const args = options.onFailure.firstCall.args;

        expect(args[0]).to.have.all.keys('actions', 'dispatch', 'onFailure', 'done');
        expect(args[1]).to.equal(request);
        expect(args[2]).to.equal('getJSON');
      });
  });
});
