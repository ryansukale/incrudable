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

    ajaxObservable()
      .getJSON(path)
      .subscribe(data => {
        expect(data).to.deep.equal(responseBody);
        done();
      });
  });

  it('returns an observable of a POST request', (done) => {
    const responseBody = {hello: 'world'};
    const request = {body: 'message'};
    mock.post(path, {
      status: 201,
      body: JSON.stringify(responseBody)
    });

    ajaxObservable()
      .postJSON(path, request)
      .subscribe(data => {
        expect(data).to.deep.equal(responseBody);
        done();
      });
  });

  it('returns an observable of a PUT request', (done) => {
    const responseBody = {hello: 'world'};
    const request = {body: 'message'};
    mock.put(path, {
      status: 200,
      body: JSON.stringify(responseBody)
    });

    ajaxObservable()
      .putJSON(path, request)
      .subscribe(data => {
        expect(data).to.deep.equal(responseBody);
        done();
      });
  });

  it('returns an observable of a DELETE request', (done) => {
    mock.delete(path, {
      status: 200
    });

    ajaxObservable()
      .delJSON(path)
      .subscribe(data => {
        expect(data).to.deep.equal('');
        done();
      });
  });
});
