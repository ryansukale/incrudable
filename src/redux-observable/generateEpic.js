import { from, of } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import createUrl from 'batarang/createUrl';

import ajaxObservable from './ajaxObservable';
import { onJsonApiResponse, onJsonApiError } from './handlers';

function identity(data) {
  return data;
}

export function epicGenerator(ajaxMethodName, config, { ajax }) {
  const {
    url,
    actions,
    onSuccess = onJsonApiResponse,
    onFailure = onJsonApiError,
    beforeSubmit = identity
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

  function epic(action$) {
    return action$.pipe(
      filter(actions.wait),
      map(({ payload }) => payload),
      beforeSubmit,
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
const list = read;

const epicGenerators = {
  create,
  read,
  update,
  del,
  list
};

const methodGeneratorMapping = {
  post: epicGenerators.create,
  get: epicGenerators.read,
  put: epicGenerators.update,
  delete: epicGenerators.del
};

function getGenerator(operation, method) {
  if (method) {
    return methodGeneratorMapping[method.toLowerCase()];
  }

  return epicGenerators[operation.toLowerCase()];
}

export default function generateEpic(
  { operation, actions, onSuccess, onFailure, beforeSubmit, url, method },
  deps = {}
) {
  const generator = getGenerator(operation, method);

  if (!generator) {
    throw new Error(`invalid HTTP method ${method} for ${operation}`);
  }

  deps.ajax = deps.ajax || ajaxObservable(deps.getHeaders);

  return generator({ url, actions, onSuccess, onFailure, beforeSubmit }, deps);
}
