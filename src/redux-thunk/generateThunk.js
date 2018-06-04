import createUrl from 'batarang/createUrl';

import {onJsonApiResponse, onJsonApiError} from './handlers';
import defaultAjax from './ajax';

function getThunkCreator(ajaxMethodName, config, {ajax}) {
  return function createThunk(request, done) {
    return (dispatch) => {
      const {
        url,
        actions,
        onSuccess = onJsonApiResponse,
        onFailure = onJsonApiError
      } = config;

      actions.wait && dispatch(actions.wait());
      
      const handlerConfig = {actions, dispatch, onFailure, done};
      const fullUrl = createUrl(url, {
        params: request.params,
        query: request.query
      });

      return ajax[ajaxMethodName](fullUrl, request)
        .then((response) => {
          return onSuccess(handlerConfig, request, response)
        })
        .catch((errors) => {
          return onFailure(handlerConfig, request, errors);
        });
    }
  }
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

export default function generateThunk({
  operation,
  actions,
  onSuccess,
  onFailure,
  url
}, config = {}) {
  const operationName = operation.toLowerCase();
  const generator = thunkGenerators[operationName];
  if (!generator) {
    throw new Error(`operation should be one of ${Object.keys(thunkGenerators)}. Received: ${type}`);
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({url, actions, onSuccess, onFailure}, config);
}
