/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';
import mock from 'xhr-mock';
import {JSDOM} from 'jsdom';
import {Blob} from 'blob-polyfill';
import FormData from 'form-data';

global.window = (new JSDOM()).window;
global.Document = window.Document;
global.Blob = Blob;
global.FormData = FormData;

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

  it('returns an observable of a GET request', (done) => {
    const responseBody = {hello: 'world'};
    const request = {body: 'message'};
    mock.post(path, {
      status: 201,
      reason: 'Created',
      body: JSON.stringify(responseBody)
    });

    ajaxObservable
      .postJSON(path, request)
      .subscribe(data => {
        expect(data).to.deep.equal(responseBody);
        done();
      });
  });
});
