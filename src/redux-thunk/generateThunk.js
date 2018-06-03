import createUrl from 'batarang/createUrl';

import {onJsonApiResponse, onJsonApiError} from './handlers';
import defaultAjax from './ajax';

// function performRequest(method) {
//   return ajax[method](fullUrl, request)
//     .then((response) => {
//       return onSuccess(config, request, response)
//     })
//     .catch((errors) => {
//       return onError(config, request, response);
//     });
// }


function getThunkCreator(ajaxMethodName, config, {ajax}) {
  return function createThunk(request, done) {
    return (dispatch) => {
      const {
        url,
        actions,
        onSuccess = onJsonApiResponse,
        onError = onJsonApiError
      } = config;

      actions.wait && dispatch(actions.wait());
      
      const handlerConfig = {actions, dispatch, onError, done};
      const fullUrl = createUrl(url, {
        params: request.params,
        query: request.query
      });

      return ajax[ajaxMethodName](fullUrl, request)
        .then((response) => {
          return onSuccess(handlerConfig, request, response)
        })
        .catch((errors) => {
          return onError(handlerConfig, request, response);
        });
    }
  }
}

// function create({
//   url,
//   actions,
//   onSuccess = onJsonApiResponse,
//   onError = onJsonApiError
// }, {ajax}) {
//   return function createThunk({params, query, body}, done) {
//     return (dispatch) => {
//       actions.wait && dispatch(actions.wait());
      
//       const request = {params, query, body};
//       const config = {actions, dispatch, onError, done};
//       const fullUrl = createUrl(url, {params, query});

//       return ajax
//         .postJSON(fullUrl, request)
//         .then((response) => {
//           return onSuccess(config, request, response)
//         })
//         .catch((errors) => {
//           return onError(config, request, response);
//         });
//     }
//   }
// }

// function read({
//   url,
//   actions,
//   onSuccess = onJsonApiResponse,
//   onError = onJsonApiError
// }, {ajax}) {
//   return function readThunk({params, query}, done) {
//     return (dispatch) => {
//       actions.wait && dispatch(actions.wait());
      
//       const request = {params, query};
//       const config = {actions, dispatch, onError, done};
//       const fullUrl = createUrl(url, {params, query});

//       return ajax
//         .getJSON(fullUrl, request)
//         .then((response) => {
//           return onSuccess(config, request, response)
//         })
//         .catch((errors) => {
//           return onError(config, request, response);
//         });
//     }
//   }
// }

// function read() {}


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
  onError,
  url
}, config = {}) {
  const operationName = operation.toLowerCase();
  const generator = thunkGenerators[operationName];
  if (!generator) {
    throw new Error(`operation should be one of ${Object.keys(thunkGenerators)}. Received: ${type}`);
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({url, actions, onSuccess, onError}, config);
}
