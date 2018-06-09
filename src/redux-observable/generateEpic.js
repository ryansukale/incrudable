import { Observable, from } from 'rxjs';
import { map, pipe, switchMap, tap, filter } from 'rxjs/operators';
import { combineEpics } from 'redux-observable';

const epicGenerators = {
  create({ url, actions, onSuccess, onFailure }, { ajax }) {
    function task(request) {
      return actions.wait(request);
    }

    function submit({payload: request}) {
      return from(ajax.getJSON(request))
        .pipe(
          map((response) =>({request, response}))
        );
    }

    function onJsonApiResponse({actions, payload}) {
      return actions.success(payload);
    }

    function epic(action$) {
      return action$
        .pipe(
          filter(actions.wait),
          switchMap(submit),
          map((payload) => onJsonApiResponse({actions, payload}))
        );
    }

    // function failureEpic(action$) {
    //   return action$
    //     .ofType(actions.wait)
    //     .pipe(
    //     map((response) => actions.failure({request: 'TODO', error: 'TODO'}))
    //   );
    // }
    
    task.epic = epic; //combineEpics(successEpic, failureEpic);

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
