/* global describe, it */
import { of } from 'rxjs';
import { expect } from 'chai';
import sinon from 'sinon';

import createActionGroup from '../../src/createActionGroup';
import generateEpic from '../../src/redux-observable/generateEpic';

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
      const ajax = { getJSON: () => Promise.resolve(response) };
      const create = getTask(options, ajax);
      const {epic} = create;
      const action$ = of(create(request));

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
      const ajax = { getJSON: () => Promise.reject(response) };
      const create = getTask(options, ajax);
      const {epic} = create;
      const action$ = of(create(request));

      epic(action$).subscribe(() => {
        expect(options.actions.wait.args[0][0]).to.deep.equal(request);
        expect(options.actions.failure.args[0][0]).to.deep.equal({request, response});
        done();
      });
    })
  });
});
