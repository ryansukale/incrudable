/* global describe, it */
import { of } from 'rxjs';
import { expect } from 'chai';
import sinon from 'sinon';
import { debounceTime, map } from 'rxjs/operators';

import createActionGroup from '../../src/createActionGroup';
import generateEpic, {
  epicGenerator
} from '../../src/redux-observable/generateEpic';

function getTask(options, ajax) {
  sinon.spy(options.actions, 'wait');
  sinon.spy(options.actions, 'success');
  sinon.spy(options.actions, 'failure');

  const config = { ajax };

  return generateEpic(options, config);
}

describe('generateEpic', () => {
  describe('"create" operation', () => {
    it('invokes the success action on ajax success', done => {
      const options = {
        operation: 'create',
        actions: createActionGroup('CREATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test' };
      const ajax = { postJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({
          request,
          response
        });
        done();
      });
    });

    it('invokes the failure action on ajax error', done => {
      const options = {
        operation: 'create',
        actions: createActionGroup('CREATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { errors: ['Test error'] };
      const ajax = { postJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({
          request,
          errors: response.errors
        });
        done();
      });
    });
  });

  describe('"read" operation', () => {
    it('invokes the success action on ajax success', done => {
      const options = {
        operation: 'read',
        actions: createActionGroup('READ_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test' };
      const ajax = { getJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({
          request,
          response
        });
        done();
      });
    });

    it('invokes the failure action on ajax error', done => {
      const options = {
        operation: 'read',
        actions: createActionGroup('READ_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { errors: ['Test error'] };
      const ajax = { getJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({
          request,
          errors: response.errors
        });
        done();
      });
    });
  });

  describe('"update" operation', () => {
    it('invokes the success action on ajax success', done => {
      const options = {
        operation: 'update',
        actions: createActionGroup('UPDATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test' };
      const ajax = { putJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({
          request,
          response
        });
        done();
      });
    });

    it('invokes the failure action on ajax error', done => {
      const options = {
        operation: 'update',
        actions: createActionGroup('UPDATE_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { errors: 'Test error' };
      const ajax = { putJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({
          request,
          errors: response.errors
        });
        done();
      });
    });
  });

  describe('"del" operation', () => {
    it('invokes the success action on ajax success', done => {
      const options = {
        operation: 'del',
        actions: createActionGroup('DEL_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test' };
      const ajax = { delJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({
          request,
          response
        });
        done();
      });
    });

    it('invokes the failure action on ajax error', done => {
      const options = {
        operation: 'del',
        actions: createActionGroup('DEL_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { errors: ['Test error'] };
      const ajax = { delJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({
          request,
          errors: response.errors
        });
        done();
      });
    });
  });

  describe('"list" operation', () => {
    it('invokes the success action on ajax success', done => {
      const options = {
        operation: 'list',
        actions: createActionGroup('LIST_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { body: 'test' };
      const ajax = { getJSON: () => Promise.resolve(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.success.args[0][0]).to.deep.equal({
          request,
          response
        });
        done();
      });
    });

    it('invokes the failure action on ajax error', done => {
      const options = {
        operation: 'list',
        actions: createActionGroup('LIST_ALBUMS'),
        url: '/albums'
      };
      const request = { body: 'hello' };
      const response = { errors: ['Test error'] };
      const ajax = { getJSON: () => Promise.reject(response) };
      const operation = getTask(options, ajax);
      const { epic } = operation;
      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({
          request,
          errors: response.errors
        });
        done();
      });
    });
  });

  describe('epicGenerator', () => {
    function prepareData({
      onSuccess,
      onFailure,
      beforeSubmit,
      request,
      ajax
    }) {
      const actions = createActionGroup('LIST_ALBUMS');
      const url = '/albums';
      const response = { body: [] };
      const config = {
        ajax: ajax || { getJSON: () => Promise.resolve(response) }
      };

      const operation = epicGenerator(
        'getJSON',
        {
          url,
          actions,
          onSuccess,
          onFailure,
          beforeSubmit
        },
        config
      );

      sinon.spy(actions, 'wait');
      sinon.spy(actions, 'success');
      sinon.spy(actions, 'failure');

      return {
        operation,
        request: request || { body: 'hello' },
        actions
      };
    }

    it('invokes the custom onSuccess function', done => {
      const onSuccess = sinon.spy(({ payload }) => {
        return {
          type: 'CUSTOM_SUCCESS',
          payload
        };
      });

      const { operation, request, actions } = prepareData({ onSuccess });
      const { epic } = operation;

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

    it('invokes the custom onFailure function', done => {
      const onFailure = sinon.spy(({ payload }) => {
        return {
          type: 'CUSTOM_FAILURE',
          payload
        };
      });

      const { operation, request, actions } = prepareData({
        onFailure,
        ajax: { getJSON: () => Promise.reject({}) }
      });
      const { epic } = operation;

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

    it('invokes the custom beforeSubmit function t', done => {
      const prefix = 'prefix';
      const paramsPreprocessor = sinon.spy(request => ({
        params: {
          id: `${prefix}_${request.params.id}`
        }
      }));

      const beforeSubmit = sinon.spy(request$ => {
        return request$.pipe(map(paramsPreprocessor));
      });
      const getJSON = sinon.spy(() => Promise.resolve({}));

      const { operation, request, actions } = prepareData({
        beforeSubmit,
        request: { params: { id: 10 } },
        ajax: { getJSON }
      });
      const { epic } = operation;

      const action$ = of(operation(request));

      epic(action$).subscribe(() => {
        expect(actions.wait.args[0][0]).to.deep.equal(request);
        // BeforeSubmit should have been called
        expect(beforeSubmit.calledOnce).to.equal(true);
        // ParamsPreprocessor is called with the same argument as the output of the wait action
        // expect(paramsPreprocessor.args[0][0]).to.deep.equal(request);

        // Ensure that the payload of the preprocessor is used as the request
        expect(getJSON.args[0][1]).to.deep.equal({
          params: { id: 'prefix_10' }
        });

        done();
      });
    });

    it('invokes the custom beforeSubmit function that is debounced', done => {
      const prefix = 'prefix';

      const paramsPreprocessor = sinon.spy(request => ({
        params: {
          id: `${prefix}_${request.params.id}`
        }
      }));
      const beforeSubmit = sinon.spy(request$ => {
        // Return a custom payload after after a debounce
        return request$.pipe(
          debounceTime(200),
          map(paramsPreprocessor)
        );
      });
      const getJSON = sinon.spy(() => Promise.resolve({}));
      const requestOne = { params: { id: 10 } };
      const requestTwo = { params: { id: 20 } };

      const { operation, actions } = prepareData({
        beforeSubmit,
        ajax: { getJSON }
      });
      const { epic } = operation;

      const action$ = of(operation(requestOne), operation(requestTwo));

      epic(action$).subscribe(() => {
        expect(actions.wait.args[0][0]).to.deep.equal(requestOne);
        expect(actions.wait.args[1][0]).to.deep.equal(requestTwo);

        // Custom beforeSubmit is called
        expect(beforeSubmit.calledOnce).to.equal(true);

        // Since the stream in beforeSubmit is debounced,
        // the paramsPreprocessor and the getJSON should only be called once
        expect(paramsPreprocessor.calledOnce).to.equal(true);

        // GetJSON should only be called once with the latest debounced input
        expect(getJSON.calledOnce).to.equal(true);
        expect(getJSON.args[0][1]).to.deep.equal({
          params: { id: 'prefix_20' }
        });

        done();
      });
    });
  });
});
