import createUrl from 'batarang/createUrl';

import { onJsonApiResponse, onJsonApiError } from './handlers';
import defaultAjax from './ajaxPromise';

function identity(data) {
  return Promise.resolve(data);
}

export function getThunkCreator(ajaxMethodName, config, { ajax }) {
  function submit(path, request) {
    return ajax[ajaxMethodName](path, request);
  }

  return function(request, done) {
    return dispatch => {
      const {
        url,
        actions,
        beforeSubmit = identity,
        onSuccess = onJsonApiResponse,
        onFailure = onJsonApiError
      } = config;

      const actionObject = actions.wait(request);

      dispatch(actionObject);

      const handlerConfig = { actions, dispatch, onFailure, done };
      
      return Promise.resolve(1)
        .then(() => beforeSubmit(actionObject))
        .then(({payload: request}) => {
          const fullUrl = createUrl(url, {
            params: request.params,
            query: request.query
          });
          return submit(fullUrl, request);
        })
        .then(response => {
          return onSuccess(handlerConfig, request, response);
        })
        .catch(errors => {
          return onFailure(handlerConfig, request, errors);
        });
    };
  };
}

const create = getThunkCreator.bind(null, 'postJSON');
const read = getThunkCreator.bind(null, 'getJSON');
const update = getThunkCreator.bind(null, 'putJSON');
const del = getThunkCreator.bind(null, 'delJSON');
const list = read;

const thunkGenerators = {
  create,
  read,
  update,
  del,
  list
};

export default function generateThunk(
  { operation, actions, onSuccess, onFailure, beforeSubmit, url },
  config = {}
) {
  const operationName = operation.toLowerCase();
  const generator = thunkGenerators[operationName];
  if (!generator) {
    throw new Error(
      `operation should be one of ${Object.keys(
        thunkGenerators
      )}. Received: ${operation}`
    );
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({ url, actions, onSuccess, onFailure, beforeSubmit }, config);
}
