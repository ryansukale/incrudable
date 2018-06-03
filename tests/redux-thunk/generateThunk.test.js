import {expect} from 'chai';
import sinon from 'sinon';

import generateThunk from '../../src/redux-thunk/generateThunk';

const resources = {
  albums: {
    name: 'albums',
    singular: 'album',
    basePath: '/data/albums'
  },
  songs: {
    name: 'songs',
    singular: 'song',
    basePath: '/data/songs'
  },
}

function createMockActions() {
  return ['wait', 'success', 'fail'].reduce((acc, type) => {
    acc[type] = sinon.stub().returns(type) // () => {console.log(type); sinon.stub().returns(type)();}
    return acc;
  }, {});
}

function createMockAjax() {
  return {
    postJSON: sinon.stub().returns(Promise.resolve('postJSON')),
    getJSON: sinon.stub().returns(Promise.resolve('getJSON'))
  };
}

describe('generateThunk', function () {
  it('actions and thunks for resources', function (done) {
    const options = {
      operation: 'create',
      actions: createMockActions(),
      url: '/users'
    };
    const config = {ajax: createMockAjax()};
    const dispatch = sinon.spy();

    const thunk = generateThunk(options, config)({body: 'hello'});

    thunk(dispatch)
      .then(() => {
        expect(options.actions.wait.calledOnce).to.equal(true);
        expect(options.actions.success.calledOnce).to.equal(true);
        expect(dispatch.calledTwice).to.equal(true);

        done();
      }).catch(done);
  });
});
