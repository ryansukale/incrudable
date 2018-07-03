import { from, of } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import createUrl from 'batarang/createUrl';

import ajaxObservable from './ajaxObservable';
import { onJsonApiResponse, onJsonApiError } from './handlers';

function identityStream(data) {
  return of(data);
}

export function epicGenerator(ajaxMethodName, config, { ajax }) {
  const { url, actions } = config;

  function task(request) {
    return actions.wait(request);
  }

  function submit(request) {
    const path = createUrl(url, {
      params: request.params,
      query: request.query
    });
    const onFailure = task.onFailure || config.onFailure || onJsonApiError;
    const onSuccess = task.onSuccess || config.onSuccess || onJsonApiResponse;
    const handlerConfig = { actions, onFailure };

    return from(ajax[ajaxMethodName](path, request)).pipe(
      map(response => onSuccess(handlerConfig, request, response)),
      catchError(response => of(onFailure(handlerConfig, request, response)))
    );
  }

  function epic(action$) {
    return action$.pipe(
      filter(actions.wait),
      switchMap(({ payload }) => {
        const beforeSubmit =
          task.beforeSubmit || config.beforeSubmit || identityStream;
        return beforeSubmit(payload);
      }),
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
  deps = {}
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

  deps.ajax = deps.ajax || ajaxObservable(deps.getHeaders);

  return generator(
    { url, actions, onSuccess, onFailure, beforeSubmit },
    deps
  );
}
