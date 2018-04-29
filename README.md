incrudable
----

Wait for it...

Define a set of resources as follows
const resources = {
  jobs: {
    basePath: '/data/jobs',
    operations: ['create', 'read', 'update', 'del']
  },
  users: {
    basePath: '/data/users',
    operations: ['create', 'read']
  },
};

```js
import incrudable from 'incrudable/redux-thunk';
import incrudable from 'incrudable/redux-observable';
```

```js
const {jobs, users} = incrudable(resources);
```

To create tooling for resources individually
```js
// With thunks
const { actions, thunks } = incrudable.fromResource(resources.jobs);

// With epics
const { actions, epics } = incrudable.fromResource(resources.jobs);
```

actions
A hash of the actions based on the list of allowed operations.
{
  create: {
    wait: ... , success: ... , fail: ...
  }
}

dispatch(actions.create.wait());
dispatch(actions.create.success(payload));
dispatch(actions.create.fail(payload));

{
  [actions.create.wait]: waitHandler,
  [actions.create.success]: successHandler,
  [actions.create.fail]: failHandler
}

{
  createJobs: ...,
  readJobs: ...,
  updateJobs: ...,
  delJobs: ...,
}

-----
```js
// modules/jobs/actions.js
export const createdByUser = generateActions('JOBS_CREATED_BY_USER');

/**
This generates an object with three named actions
createdByUser = {
  success: f()...
  error: f() ...
  wait: f()...
};
**/

// Within a reducer you can listen to these actions
// modules/jobs/reducer.js
import {createdByUser} from '../modules/jobs/actions';

export default createReducer({
  [createdBy.wait]: () => ({isLoading: true}),
  [createdBy.success]: (state, payload) => ({...state, ...payload}) ,
  [createdBy.error]: (state, payload) => ({errors: payload})
}, {});

// modules/jobs/tasks/crud.js
const endpoints = {
  create: '/api/jobs',
  read: '/api/jobs/{id}'
  update: '/api/jobs/{id}',
  del: '/api/jobs/{id}',
  list: '/api/jobs'
};

export default generateTasks('JOBS', endpoints);

// tasks/initDashboard.js
import {list as listAlbums} from '../modules/jobs/tasks/crud';
import jobActions from '../modules/jobs/actions';

dispatch(
  listAlbums(
    {query: {created_by: 122}}
    {actions: jobActions.createdByUser}
  )
);

dispatch(
  updateAlbum(
    {data: {title: 'By the rivers of Babylon'}}
    {params: {id: 10}},
    {actions: jobActions.createdByUser}
  )
);
```


----

Alternative - An Rxjs like interface


```js
// modules/jobs/actions.js
export const createdByUser = generateActions('JOBS_CREATED_BY_USER');

// This will export an object with three functions
{
  success: f()...
  error: f() ...
  wait: f()...
}

import {list as listAlbums} from '../modules/jobs/tasks/crud';
import jobActions from '../modules/jobs/actions';

dispatch(
  listAlbums(data, jobActions.createdByUser)
);


listAlbums({
  success: f()
  error: f()
  wait: f()
})

listAlbums(data, successAction);
listAlbums(successAction, errorAction, waitAction);
listAlbums({
  success: successAction,
  error: errorAction,
  wait: waitAction
})

```