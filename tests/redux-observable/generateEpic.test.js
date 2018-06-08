/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, merge, tap } from 'rxjs/operators';

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
    postJSON: () => Promise.resolve('postJSON'),
    getJSON: () => Promise.resolve('getJSON'),
    putJSON: () => Promise.resolve('putJSON'),
    delJSON: () => Promise.resolve('delJSON')
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
    const {epic} = create;

    expect(epic).to.be.a('function');

    const epicMiddleware = createEpicMiddleware(epic);
    const mockStore = configureMockStore([epicMiddleware]);
    const store = mockStore();
    const action = create(request);

    // --- Working example----
    //  const source$ = of(1);
    // const network$ = from(config.ajax.getJSON('TEST'));
    // source$
    //   .pipe(
    //     switchMap((response) => network$),
    //     tap(response => console.log('response', response))
    //   ).subscribe(val => console.log('val', val));
    //   --- Working example----

    store.dispatch(action);
    const storeActions = store.getActions();

    expect(storeActions.length).to.equal(2);
    expect(action).to.deep.equal(options.actions.wait(request));
    expect(storeActions[0]).to.deep.equal({
      type: `${options.actions.wait}`,
      payload: request
    });

    expect(storeActions[1]).to.deep.equal({
      type: `${options.actions.success}`,
      payload: {request, response: 'TODO'}
    });
  });
});
