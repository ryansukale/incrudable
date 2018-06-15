/* global describe, it */
import { of } from 'rxjs';
import { expect } from 'chai';
import sinon from 'sinon';

import createActionGroup from '../../src/createActionGroup';
import generateEpic, {epicGenerator} from '../../src/redux-observable/generateEpic';

describe('generateEpic', () => {
  function getTask(options, ajax) {
    sinon.spy(options.actions, 'wait');
    sinon.spy(options.actions, 'success');
    sinon.spy(options.actions, 'failure');

    const config = { ajax };

    return generateEpic(options, config)
  }

  describe('"create" operation', () => {
    it('invokes the success action on ajax success', (done) => {
      const options = {
        operation: 'create',
        actions: createActionGroup('CREATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test'};
      const ajax = { postJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({request, response});
        done();
      });
    });

    it('invokes the failure action on ajax error', (done) => {
      const options = {
        operation: 'create',
        actions: createActionGroup('CREATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'Test error'};
      const ajax = { postJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    });
  });

  describe('"read" operation', () => {
    it('invokes the success action on ajax success', (done) => {
      const options = {
        operation: 'read',
        actions: createActionGroup('READ_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test'};
      const ajax = { getJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })

    it('invokes the failure action on ajax error', (done) => {
      const options = {
        operation: 'read',
        actions: createActionGroup('READ_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'Test error'};
      const ajax = { getJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })
  });

  describe('"update" operation', () => {
    it('invokes the success action on ajax success', (done) => {
      const options = {
        operation: 'update',
        actions: createActionGroup('UPDATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test'};
      const ajax = { putJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })

    it('invokes the failure action on ajax error', (done) => {
      const options = {
        operation: 'update',
        actions: createActionGroup('UPDATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'Test error'};
      const ajax = { putJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })
  });

  describe('"del" operation', () => {
    it('invokes the success action on ajax success', (done) => {
      const options = {
        operation: 'del',
        actions: createActionGroup('DEL_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test'};
      const ajax = { delJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })

    it('invokes the failure action on ajax error', (done) => {
      const options = {
        operation: 'del',
        actions: createActionGroup('DEL_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'Test error'};
      const ajax = { delJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })
  });

  describe('"list" operation', () => {
    it('invokes the success action on ajax success', (done) => {
      const options = {
        operation: 'list',
        actions: createActionGroup('LIST_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test'};
      const ajax = { getJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({request, response});
        done();
      });
    });

    it('invokes the failure action on ajax error', (done) => {
      const options = {
        operation: 'list',
        actions: createActionGroup('LIST_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'Test error'};
      const ajax = { getJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const {epic} = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    });
  });

  describe('epicGenerator', () => {
    function prepareData({onSuccess, onFailure, beforeSubmit, ajax}) {
      const actions = createActionGroup('LIST_ALBUMS');
      const url = '/albums';
      const request = { body: 'hello' };
      const response = { body: [] };
      const config = {
        ajax: ajax || { getJSON: () => Promise.resolve(response) }
      };

      const operation = epicGenerator('getJSON', {
        url,
        actions,
        onSuccess,
        onFailure,
        beforeSubmit
      }, config);
      
      sinon.spy(actions, 'wait');
      sinon.spy(actions, 'success');
      sinon.spy(actions, 'failure');

      return {operation, request, actions};
    }

    it('invokes the custom onSuccess function', (done) => {
      const onSuccess = sinon.spy(function ({actions, payload}) {
        return {
          type: 'CUSTOM_SUCCESS',
          payload
        };
      });
      
      const {operation, request, actions} = prepareData({onSuccess});
      const {epic} = operation;

      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(actions.wait.args[0][0]).to.deep.equal(request);
        // Custom onSuccess is called
        expect(onSuccess.calledOnce).to.equal(true);
        // Default action is NOT called
        expect(actions.success.called).to.equal(false);
        done();
      });
    });

    it('invokes the custom onFailure function', (done) => {
      const onFailure = sinon.spy(function ({actions, payload}) {
        return {
          type: 'CUSTOM_FAILURE',
          payload
        };
      });
      
      const {operation, request, actions} = prepareData({
        onFailure,
        ajax: { getJSON: () => Promise.reject({}) }
      });
      const {epic} = operation;

      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(actions.wait.args[0][0]).to.deep.equal(request);
        // Custom onFailure is called
        expect(onFailure.calledOnce).to.equal(true);
        // Default action is NOT called
        expect(actions.failure.called).to.equal(false);
        done();
      });
    });

    it('invokes the custom beforeSubmit function', (done) => {
      const suffix = 'modified_or_delayed';
      const beforeSubmit = sinon.spy(function (request) {
        return of({body: `${request.body}_${suffix}`});
      });

      const {operation, request, actions} = prepareData({
        beforeSubmit,
        ajax: { getJSON: () => Promise.resolve({}) }
      });
      const {epic} = operation;

      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(actions.wait.args[0][0]).to.deep.equal(request);
        // Custom beforeSubmit is called
        expect(beforeSubmit.calledOnce).to.equal(true);
        // beforeSubmit is called with the same argument as the output of the wait action
        expect(beforeSubmit.args[0][0]).to.deep.equal(actions.wait(request));

        done();
      });
    });
  });
});
