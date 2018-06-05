import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
// function getEpicCreator(ajaxMethodName, config, { ajax }) {
//   const {
//     url,
//     actions,
//     onSuccess = onJsonApiResponse,
//     onFailure = onJsonApiError
//   } = config;

//   function waitAction(request, done) {
//     const {actions} = config;
//     return actions.wait(request));
//   }

//   function success(action$) {
//     action$
//       .ofType(actions.wait)
//       .switchMap(({payload}) => ajax[ajaxMethodName](fullUrl, payload))
//       .map((response) => onSuccess(handlerConfig, request, response));
//   }

//   return waitAction;
// }


// const create = getEpicCreator.bind(null, 'postJSON');
// const read = getThunkCreator.bind(null, 'getJSON');
// const update = getThunkCreator.bind(null, 'putJSON');
// const del = getThunkCreator.bind(null, 'delJSON');
// const list = read;

const epicGenerators = {
  create({ url, actions, onSuccess, onFailure }, { ajax }) {
    function successEpic(action$) {

    }

    function failureEpic(action$) {

    }
    
    actions.wait.epics = combineEpics(successEpic, failureEpic);

    return actions.wait;
  }
};

export default function generateEpic(
  { operation, actions, onSuccess, onFailure, url },
  config = {}
) {
  const operationName = operation.toLowerCase();
  const generator = epicGenerators[operationName];
  if (!generator) {
    throw new Error(
      `operation should be one of ${Object.keys(
        epicGenerators
      )}. Received: ${operation}`
    );
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({ url, actions, onSuccess, onFailure }, config);
}
