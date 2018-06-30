import { from, of } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import createUrl from 'batarang/createUrl';

import ajaxObservable from './ajaxObservable';

function identity(request) {
  return of(request);
}

export function epicGenerator(ajaxMethodName, config, { ajax }) {
  const {
    url,
    actions,
    beforeSubmit = identity,
    onSuccess = onJsonApiResponse,
    onFailure = onJsonApiError
  } = config;

  function task(request) {
    return actions.wait(request);
  }

  function submit(request) {
    const path = createUrl(url, {
      params: request.params,
      query: request.query
    });

    const handlerConfig = { actions, onFailure };

    return from(ajax[ajaxMethodName](path, request)).pipe(
      map(response => onSuccess(handlerConfig, request, response)),
      catchError(response => of(onFailure(handlerConfig, request, response)))
    );
  }

  function onJsonApiResponse({ actions, onFailure }, request, response) {
    if (response.errors) {
      return onFailure({ actions }, request, response);
    }
    const payload = { request, response };
    return actions.success(payload);
  }

  function onJsonApiError({ actions }, request, response) {
    const payload = { request, errors: response.errors };
    return actions.failure(payload);
  }

  function epic(action$) {
    return action$.pipe(
      filter(actions.wait),
      switchMap(({ payload }) => beforeSubmit(payload)),
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
  { operation, actions, onSuccess, onFailure, beforeSubmit, url },
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

  config.ajax = config.ajax || ajaxObservable(config.getHeaders);

  return generator(
    { url, actions, onSuccess, onFailure, beforeSubmit },
    config
  );
}
