import { Observable, from, of } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
// import { combineEpics } from 'redux-observable';

function epicGenerator(ajaxMethodName, config, { ajax }) {
  const {
    url,
    actions,
    onSuccess,
    onFailure
  } = config;

  function task(request) {
    return actions.wait(request);
  }

  function submit({payload: request}) {
    return from(ajax[ajaxMethodName](request))
      .pipe(
        map(
          (response) => onJsonApiResponse({actions, payload: {request, response}})
        ),
        catchError(
          (response) => of(
            onJsonApiError({actions, payload: {request, response}})
          )
        )
      );
  }

  function onJsonApiResponse({actions, payload}) {
    return actions.success(payload);
  }

  function onJsonApiError({actions, payload}) {
    return actions.failure(payload);
  }

  function epic(action$) {
    return action$
      .pipe(
        filter(actions.wait),
        switchMap(submit)
      );
  }
  
  task.epic = epic;

  return task;
}

const create = epicGenerator.bind(null, 'postJSON');
const read = epicGenerator.bind(null, 'getJSON');
const update = epicGenerator.bind(null, 'putJSON');
const del = epicGenerator.bind(null, 'delJSON');

const epicGenerators = {
  create,
  read,
  update,
  del,
  list: read
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
