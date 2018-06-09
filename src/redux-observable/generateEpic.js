import { Observable, from, of } from 'rxjs';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
// import { combineEpics } from 'redux-observable';

const epicGenerators = {
  create({ url, actions, onSuccess, onFailure }, { ajax }) {
    function task(request) {
      return actions.wait(request);
    }

    function submit({payload: request}) {
      return from(ajax.getJSON(request))
        .pipe(
          map((response) =>({request, response})),
          map((payload) => onJsonApiResponse({actions, payload})),
          catchError((error) => of(actions.failure({request, response: error})))
          // catchError((error) => from(error))

          // catchError(error => { console.log(error); return from(actions.failure(error))}),
        );
    }

    function onJsonApiResponse({actions, payload}) {
      console.log('got to success');
      return actions.success(payload);
    }

    function epic(action$) {
      return action$
        .pipe(
          filter(actions.wait),
          switchMap(submit),
          // catchError((error) => of(actions.failure(error)))
          // catchError(error => { console.log(error); return from(actions.failure(error))}),
          // map((payload) => onJsonApiResponse({actions, payload})),
          // catchError(()=> onJsonApiResponse({actions, payload: 'payload'}))
        );
    }
    
    task.epic = epic;

    return task;
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
