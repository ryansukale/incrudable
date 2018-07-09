/* global describe, it */
import { expect } from 'chai';
import sinon from 'sinon';

import {
  onJsonApiResponse,
  onJsonApiError
} from '../../src/redux-thunk/handlers';

function getHandlerConfigSpies() {
  return {
    dispatch: sinon.spy(),
    actions: {
      success: sinon.spy(),
      failure: sinon.spy()
    },
    onFailure: sinon.spy(),
    done: sinon.spy()
  };
}

const request = { params: { id: 10 } };

describe('redux-thunk response handlers', () => {
  describe('onJsonApiResponse', () => {
    it('dispatches success action', () => {
      const config = getHandlerConfigSpies();
      const response = { data: {} };
      onJsonApiResponse(config, request, response);

      expect(config.dispatch.calledOnce).to.equal(true);
      expect(config.actions.success.calledOnce).to.equal(true);
      expect(config.done.calledOnce).to.equal(true);
    });

    it('invokes onFailure when response has an errors key', () => {
      const config = getHandlerConfigSpies();
      const response = { errors: {} };
      onJsonApiResponse(config, request, response);

      expect(config.onFailure.calledOnce).to.equal(true);
    });
  });

  describe('onJsonApiError', () => {
    it('dispatches failure action', () => {
      const config = getHandlerConfigSpies();
      const response = { data: {} };
      onJsonApiError(config, request, response);

      expect(config.dispatch.calledOnce).to.equal(true);
      expect(config.actions.failure.calledOnce).to.equal(true);
      expect(config.done.calledOnce).to.equal(true);
    });

    it('sends errors to the failure action response has errors key', () => {
      const config = getHandlerConfigSpies();
      const response = { errors: {} };
      onJsonApiError(config, request, response);

      expect(config.actions.failure.args[0][0]).to.deep.equal({
        request,
        errors: response.errors
      });
    });
  });
});
