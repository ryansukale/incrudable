import createUrl from 'batarang/createUrl';

import {onJsonApiResponse, onJsonApiError} from './handlers';
import defaultAjax from './ajax';

function create({
  url,
  actions,
  onResponse = onJsonApiResponse,
  onError = onJsonApiError
}, {ajax}) {
  return function createThunk({params, query, body}, done) {
    return (dispatch) => {
      actions.wait && dispatch(actions.wait());

      const request = {params, query, body};
      const config = {actions, dispatch, onError, done};
      const fullUrl = createUrl(url, {params, query});

      return ajax
        .postJSON(fullUrl, request)
        .then((response) => {
          return onSuccess(config, request, response)
        })
        .catch((errors) => {
          return onError(config, request, response);
        });
    }
  }
}

function read() {

}

function update() {

}

function del() {

}

function list() {

}

export const thunkGenerators = {
  create,
  read,
  update,
  del,
  list
};

export default function generateThunk({
  operation,
  actions,
  url
}, config = {}) {
  const operationName = operation.toLowerCase();
  const generator = thunkGenerators[operationName];
  if (!generator) {
    throw new Error(`operation should be one of ${Object.keys(thunkGenerators)}. Received: ${type}`);
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({url, actions}, config);
}
