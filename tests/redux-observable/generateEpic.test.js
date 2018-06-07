/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';
// import { Observable, of } from 'rxjs';
// import { map } from 'rxjs/operators';

import configureMockStore from 'redux-mock-store';
import { createEpicMiddleware } from 'redux-observable';
// import { fetchUserEpic, fetchUser, FETCH_USER } from '../../redux/modules/user';

// const epicMiddleware = createEpicMiddleware(fetchUserEpic);
// const mockStore = configureMockStore([epicMiddleware]);


import createActionGroup from '../../src/createActionGroup';
import generateEpic from '../../src/redux-observable/generateEpic';

// function createMockActions() {
//   return ['wait', 'success', 'failure'].reduce((acc, type) => {
//     acc[type] = sinon.stub().returns(type); // () => {console.log(type); sinon.stub().returns(type)();}
//     return acc;
//   }, {});
// }

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
      actions: createActionGroup('CREATE_ALBUMS'),
      url: '/albums'
    };
    const config = { ajax: createMockAjax() };
    const request = { body: 'hello' };

    const create = generateEpic(options, config);
    const {epics} = create;

    expect(epics).to.be.a('function');

    const epicMiddleware = createEpicMiddleware(epics);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const action = create(request);
    store.dispatch(action);
    const storeActions = store.getActions();

    expect(action).to.deep.equal(options.actions.wait(request));
    expect(storeActions[0]).to.deep.equal({
      type: options.actions.wait.toString(),
      payload: request
    });

    expect(storeActions[1]).to.deep.equal({
      type: options.actions.success.toString(),
      payload: {request, response: 'TODO'}
    });
    
    // const action$ = of(action);

    // action$.map(d => console.log(d));
    // const epics(action$);


    // action$.subscribe((data) => {
    //   // epics(action$);
    //   // console.log('data', data);
    //   expect(options.actions.success.calledOnce).to.equal(true);
    //   // done();
    // });

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
