/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

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
  it('generates task for `create` along with the corresponding epics', () => {
    const options = {
      operation: 'create',
      actions: createMockActions(),
      url: '/users'
    };
    const config = { ajax: createMockAjax() };
    const request = { body: 'hello' };

    const create = generateEpic(options, config);
    expect(create(request)).to.equal(options.actions.wait(request));
    expect(create.epics).to.be.a('function');
    

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
