/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


import generateEpic from '../../src/redux-observable/generateEpic';

function createMockActions() {
  return ['wait', 'success', 'failure'].reduce((acc, type) => {
    acc[type] = sinon.stub().returns(type); // () => {console.log(type); sinon.stub().returns(type)();}
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

describe('generateEpic', () => {
  it('generates task for `create` along with the corresponding epics', (done) => {
    const options = {
      operation: 'create',
      actions: createMockActions(),
      url: '/users'
    };
    const config = { ajax: createMockAjax() };
    const request = { body: 'hello' };

    const create = generateEpic(options, config);
    const action = create(request);

    expect(action).to.equal(options.actions.wait(request));

    const {epics} = create;
    expect(epics).to.be.a('function');
    
    const action$ = of(action);

    // action$.map(d => console.log(d));
    // const epics(action$);


    action$.subscribe((data) => {
      // epics(action$);
      // console.log('data', data);
      expect(options.actions.success.calledOnce).to.equal(true);
      // done();
    });

    // task().subscribe()

    // return task().then(() => {
    //   expect(options.actions.wait.calledOnce).to.equal(true);
    //   // expect(options.actions.success.calledOnce).to.equal(true);
    //   // expect(dispatch.calledTwice).to.equal(true);

    //   // expect(config.ajax.postJSON.calledOnce);
    //   // expect(config.ajax.postJSON.firstCall.args[0]).to.equal('/users');
    // });
  });
});
