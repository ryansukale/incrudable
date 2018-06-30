/* global describe, it, beforeEach, afterEach */
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import mock from 'xhr-mock';

import ajaxObservable, {
  DEAULT_HEADERS
} from '../../src/redux-observable/ajaxObservable';

chai.use(chaiSubset);
const path = '/albums';

const customHeaders = {
  'x-custom-header': 'value'
};

function getHeaders() {
  return customHeaders;
}

const mockMap = {
  getJSON: 'get',
  postJSON: 'post',
  putJSON: 'put',
  delJSON: 'delete'
};

function assertCustomHeader(methodName, options) {
  const httpMethod = mockMap[methodName];

  mock[httpMethod](path, (req, res) => {
    expect(req.headers()).to.containSubset({
      ...DEAULT_HEADERS,
      ...customHeaders
    });
    return res.status(200).body('{}');
  });
  return ajaxObservable(getHeaders)[methodName](path, options);
}

describe('ajaxObservable', () => {
  beforeEach(() => {
    mock.setup();
  });

  afterEach(() => {
    mock.teardown();
  });

  describe('getJSON', () => {
    it('returns an observable of a GET request', done => {
      const responseBody = { hello: 'world' };
      mock.get(path, (req, res) => {
        expect(req.headers()).to.containSubset(DEAULT_HEADERS);
        return res.status(200).body(JSON.stringify(responseBody));
      });

      ajaxObservable()
        .getJSON(path)
        .subscribe(data => {
          expect(data).to.deep.equal(responseBody);
          done();
        });
    });

    it('uses custom headers in the GET request', done => {
      return assertCustomHeader('getJSON').subscribe(() => done());
    });
  });

  describe('postJSON', () => {
    const request = { body: 'message' };
    it('returns an observable of a POST request', done => {
      const responseBody = { hello: 'world' };
      mock.post(path, (req, res) => {
        expect(req.headers()).to.containSubset(DEAULT_HEADERS);
        return res.status(201).body(JSON.stringify(responseBody));
      });

      ajaxObservable()
        .postJSON(path, request)
        .subscribe(data => {
          expect(data).to.deep.equal(responseBody);
          done();
        });
    });

    it('uses custom headers in the POST request', done => {
      return assertCustomHeader('postJSON', request).subscribe(() => done());
    });
  });

  describe('putJSON', () => {
    const request = { body: 'message' };

    it('returns an observable of a PUT request', done => {
      const responseBody = { hello: 'world' };
      mock.put(path, (req, res) => {
        expect(req.headers()).to.containSubset(DEAULT_HEADERS);
        return res.status(200).body(JSON.stringify(responseBody));
      });

      ajaxObservable()
        .putJSON(path, request)
        .subscribe(data => {
          expect(data).to.deep.equal(responseBody);
          done();
        });
    });

    it('uses custom headers in the PUT request', done => {
      return assertCustomHeader('putJSON', request).subscribe(() => done());
    });
  });

  describe('delJSON', () => {
    it('returns an observable of a DELETE request', done => {
      mock.delete(path, (req, res) => {
        expect(req.headers()).to.containSubset(DEAULT_HEADERS);
        return res.status(200).body('');
      });

      ajaxObservable()
        .delJSON(path)
        .subscribe(data => {
          expect(data).to.deep.equal('');
          done();
        });
    });

    it('uses custom headers in the DELETE request', done => {
      return assertCustomHeader('delJSON').subscribe(() => done());
    });
  });
});
