import createUrl from 'batarang/createUrl';

import { onJsonApiResponse, onJsonApiError } from './handlers';
import ajaxPromise from './ajaxPromise';

function requestIdentity({ request }) {
  return Promise.resolve(request);
}

export function getThunkCreator(ajaxMethodName, config, { ajax }) {
  return function(request, done) {
    return dispatch => {
      const {
        url,
        actions,
        beforeSubmit = requestIdentity,
        onSuccess = onJsonApiResponse,
        onFailure = onJsonApiError
      } = config;

      const actionObject = actions.wait({ request });

      dispatch(actionObject);

      const handlerConfig = { actions, dispatch, onFailure, done };

      function submit({ request }) {
        const path = createUrl(url, {
          params: request.params,
          query: request.query
        });
        return ajax[ajaxMethodName](path, request);
      }

      return Promise.resolve(1)
        .then(() => beforeSubmit(actionObject.payload))
        .then(request => submit({ request }))
        .then(response => {
          return onSuccess(handlerConfig, request, response);
        })
        .catch(response => {
          return onFailure(handlerConfig, request, response);
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

  config.ajax = config.ajax || ajaxPromise(config.getHeaders);

  return generator(
    { url, actions, onSuccess, onFailure, beforeSubmit },
    config
  );
}
