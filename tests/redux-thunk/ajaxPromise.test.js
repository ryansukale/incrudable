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
  const customHeaders = {
    'x-custom-header': 'value'
  };

  function getHeaders() {
    return customHeaders;
  }

  function assertCustomHeader(methodName, options) {
    return ajaxPromise(getHeaders)[methodName](path, options)
      .then(data => {
        const args = fetchSpy.args[0];
        expect(args[1].headers).to.deep.equal({
          ...DEAULT_HEADERS,
          ...customHeaders
        });
      });
  }

  beforeEach(() => {
    prevFetch = global.fetch;
    fetchSpy = createFetchSpy();
    responseBody = undefined;
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    global.fetch = prevFetch;
  });

  describe('getJSON', () => {
    it('invokes fetch with the params of GET request', () => {
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

    it('uses custom headers in the GET request', () => {
      return assertCustomHeader('getJSON');
    });
  });

  describe('postJSON', () => {
    it('invokes fetch with the params of POST request', () => {
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

    it('uses custom headers in the POST request', () => {
      responseBody = {hello: 'world'};
      const body = {x: 10};
      return assertCustomHeader('postJSON', {body});
    });
  });

  describe('putJSON', () => {
    it('invokes fetch with the params of PUT request', () => {
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

    it('uses custom headers in the PUT request', () => {
      responseBody = {hello: 'world'};
      const body = {x: 10};
      return assertCustomHeader('putJSON', {body});
    });
  });

  describe('delJSON', () => {
    it('invokes fetch with the params of DELETE request', () => {
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

    it('uses custom headers in the DELETE request', () => {
      responseBody = undefined;
      return assertCustomHeader('delJSON');
    });
  });
});
