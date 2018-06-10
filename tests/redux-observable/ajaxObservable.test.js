/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';
import mock from 'xhr-mock';

import ajaxObservable from '../../src/redux-observable/ajaxObservable';
const path = '/albums';

describe('ajaxObservable', () => {
  before(() => {
    mock.setup();
  });

  after(() => {
    mock.teardown();
  });

  it('returns an observable of a GET request', (done) => {
    const responseBody = {hello: 'world'};
    mock.get(path, {
      status: 200,
      body: JSON.stringify(responseBody)
    });

    ajaxObservable
      .getJSON(path)
      .subscribe(data => {
        expect(data).to.deep.equal(responseBody);
        done();
      });
  });
});
