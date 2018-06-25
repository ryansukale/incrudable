/* global describe, it */
// var chai = require('chai');
import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
import sinon from 'sinon';
import mock from 'xhr-mock';

chai.use(chaiSubset);

import ajaxObservable, { DEAULT_HEADERS } from '../../src/redux-observable/ajaxObservable';
const path = '/albums';

describe('ajaxObservable', () => {
  before(() => {
    mock.setup();
  });

  after(() => {
    mock.teardown();
  });

  describe('getJSON', () => {
    it('returns an observable of a GET request', (done) => {
      const responseBody = {hello: 'world'};
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
  });

  describe('postJSON', () => {
    it('returns an observable of a POST request', (done) => {
      const responseBody = {hello: 'world'};
      const request = {body: 'message'};
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
  });

  describe('putJSON', () => {
    it('returns an observable of a PUT request', (done) => {
      const responseBody = {hello: 'world'};
      const request = {body: 'message'};
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
  });

  describe('delJSON', () => {
    it('returns an observable of a DELETE request', (done) => {
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
  });
});
