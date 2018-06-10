/* global describe, it */
import { of } from 'rxjs';
import { expect } from 'chai';
import sinon from 'sinon';

import createActionGroup from '../../src/createActionGroup';
import generateEpic from '../../src/redux-observable/generateEpic';

describe.only('generateEpic', () => {
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
    })

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
    })
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
    })

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
    })
  });
});
