/* global describe, it */
import { of } from 'rxjs';
import { expect } from 'chai';
import sinon from 'sinon';

import createActionGroup from '../../src/createActionGroup';
import generateEpic from '../../src/redux-observable/generateEpic';

describe('generateEpic', () => {
  it('generates task for `create` and calls the success action', (done) => {
    const options = {
      operation: 'create',
      actions: createActionGroup('CREATE_ALBUMS'),
      url: '/albums'
    };

    sinon.spy(options.actions, 'wait');
    sinon.spy(options.actions, 'success');

    const request = { body: 'hello' };
    const response = { body: 'test'};
    const config = { ajax: {getJSON: () => Promise.resolve(response)} };

    const create = generateEpic(options, config);
    const {epic} = create;

    expect(epic).to.be.a('function');

    const action$ = of(create(request));

    epic(action$).subscribe(() => {
      expect(options.actions.wait.args[0][0]).to.deep.equal(request);
      expect(options.actions.success.args[0][0]).to.deep.equal({
        request,
        response
      });
      done();
    });
  });

  it('generates task for `create` and calls the failure action', (done) => {
    const options = {
      operation: 'create',
      actions: createActionGroup('CREATE_ALBUMS'),
      url: '/albums'
    };

    sinon.spy(options.actions, 'wait');
    sinon.spy(options.actions, 'success');
    sinon.spy(options.actions, 'failure');

    const request = { body: 'hello' };
    const response = { body: 'Test error'};
    const config = { ajax: {getJSON: () => Promise.reject(response)} };

    const create = generateEpic(options, config);
    const {epic} = create;

    expect(epic).to.be.a('function');

    const action$ = of(create(request));

    epic(action$).subscribe(() => {
      expect(options.actions.wait.args[0][0]).to.deep.equal(request);
      expect(options.actions.failure.args[0][0]).to.deep.equal({
        request,
        response
      });
      done();
    });
  });
});
