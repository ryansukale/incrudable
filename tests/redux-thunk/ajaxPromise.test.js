/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import ajaxPromise, { DEAULT_HEADERS } from '../../src/redux-thunk/ajaxPromise';
const path = 'http://example.com/albums';

describe('ajaxPromise', () => {
  let prevFetch;
  let responseBody;
  let fetchSpy;
  const mockFetchResponse = Promise.resolve({
    ok: true,
    json: () => Promise.resolve(responseBody)
  });
  const createFetchSpy = () => sinon.spy(() => mockFetchResponse);

  beforeEach(() => {
    prevFetch = global.fetch;
    fetchSpy = createFetchSpy();
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    global.fetch = prevFetch;
  });

  it('returns an observable of a GET request', () => {
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

  it('returns an observable of a POST request', () => {
    responseBody = {hello: 'world'};
    const body = {x: 10};

    return ajaxPromise()
      .postJSON(path, {body})
      .then(data => {
        expect(data).to.deep.equal(responseBody);
        expect(fetchSpy.getCalls().length).to.equal(1);

        const args = fetchSpy.args[0];
        
        expect(args[0]).to.equal(path);
        expect(args[1]).to.deep.equal({
          method: 'POST',
          body: JSON.stringify(body),
          headers: DEAULT_HEADERS
        });
      });
  });

  it('returns an observable of a PUT request', () => {
    responseBody = {hello: 'world'};
    const body = {x: 10};

    return ajaxPromise()
      .putJSON(path, {body})
      .then(data => {
        expect(data).to.deep.equal(responseBody);
        expect(fetchSpy.getCalls().length).to.equal(1);

        const args = fetchSpy.args[0];
        
        expect(args[0]).to.equal(path);
        expect(args[1]).to.deep.equal({
          method: 'PUT',
          body: JSON.stringify(body),
          headers: DEAULT_HEADERS
        });
      });
  });

  it('returns an observable of a DELETE request', () => {
    responseBody = undefined;
    
    return ajaxPromise()
      .delJSON(path)
      .then(data => {
        expect(data).to.deep.equal(responseBody);
        expect(fetchSpy.getCalls().length).to.equal(1);

        const args = fetchSpy.args[0];
        
        expect(args[0]).to.equal(path);
        expect(args[1]).to.deep.equal({
          method: 'DELETE',
          headers: DEAULT_HEADERS
        });
      });
  });
});
