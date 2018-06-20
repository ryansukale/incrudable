/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import ajaxPromise, { DEAULT_HEADERS } from '../../src/redux-thunk/ajaxPromise';
const path = 'http://example.com/albums';

describe('ajaxPromise', () => {
  let prevFetch;
  let responseBody;
  const mockFetchResponse = Promise.resolve({
    ok: true,
    json: () => Promise.resolve(responseBody)
  });
  const fetchSpy = sinon.spy(() => mockFetchResponse);

  before(() => {
    prevFetch = global.fetch;
    global.fetch = fetchSpy;
  });

  after(() => {
    global.fetch = prevFetch;
  });

  it.only('returns an observable of a GET request', () => {
    responseBody = {hello: 'world'};

    return ajaxPromise()
      .getJSON(path)
      .then(data => {
        expect(data).to.deep.equal(responseBody);
        expect(fetchSpy.getCalls().length).to.equal(1);

        const args = fetchSpy.args[0];
        expect(args[0]).to.equal(path);
        expect(args[1]).to.deep.equal({
          headers: DEAULT_HEADERS
        });
      });
  });

  it('returns an observable of a POST request', (done) => {
    const responseBody = {hello: 'world'};
    const request = {body: 'message'};
    mock.post(path, {
      status: 201,
      body: JSON.stringify(responseBody)
    });

    ajaxPromise
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

    ajaxPromise
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

    ajaxPromise
      .delJSON(path)
      .subscribe(data => {
        expect(data).to.deep.equal('');
        done();
      });
  });
});
