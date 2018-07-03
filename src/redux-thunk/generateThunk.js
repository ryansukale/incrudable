import createUrl from 'batarang/createUrl';

import { onJsonApiResponse, onJsonApiError } from './handlers';
import ajaxPromise from './ajaxPromise';

function identity(data) {
  return Promise.resolve(data);
}

export function getThunkCreator(ajaxMethodName, config, { ajax }) {
  return function thunk(request, done) {
    return dispatch => {
      const { url, actions } = config;

      const actionObject = actions.wait(request);
      const beforeSubmit =
        thunk.beforeSubmit || config.beforeSubmit || identity;
      const onSuccess =
        thunk.onSuccess || config.onSuccess || onJsonApiResponse;
      const onFailure = thunk.onFailure || config.onFailure || onJsonApiError;

      dispatch(actionObject);

      const handlerConfig = { actions, dispatch, onFailure, done };

      function submit(request) {
        const path = createUrl(url, {
          params: request.params,
          query: request.query
        });
        return ajax[ajaxMethodName](path, request);
      }

      return Promise.resolve(1)
        .then(() => beforeSubmit(actionObject.payload))
        .then(submit)
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

const methodGeneratorMapping = {
  post: thunkGenerators.create,
  get: thunkGenerators.read,
  put: thunkGenerators.update,
  delete: thunkGenerators.del
};

function getGenerator(operation, method) {
  if (method) {
    return methodGeneratorMapping[method.toLowerCase()];
  }

  return thunkGenerators[operation.toLowerCase()];
}

export default function generateThunk(
  { operation, actions, onSuccess, onFailure, beforeSubmit, url, method },
  deps = {}
) {
  const generator = getGenerator(operation, method);

  if (!generator) {
    if (!method) {
      throw new Error(
        `default operations should be one of ${Object.keys(
          thunkGenerators
        )}. Received: ${operation}. Add a 'method' attribute for this custom operation.`
      );
    }

    throw new Error(`invalid HTTP method ${method} for ${operation}`);
  }

  deps.ajax = deps.ajax || ajaxPromise(deps.getHeaders);

  return generator(
    { url, actions, onSuccess, onFailure, beforeSubmit },
    deps
  );
}
