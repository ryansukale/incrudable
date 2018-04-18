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
export const createdBy = generateActions('JOBS_CREATED_BY_USER');

// This will export an object with three functions
{
  wait: f()...
  success: f()...
  fail: f() ...
}

// Within a reducer you can listen to these events
// modules/jobs/reducer.js
import {createdBy} from '../modules/jobs/actions';

export default createReducer({
  [createdBy.wait]: () => ({isLoading: true}),
  [createdBy.success]: (state, payload) => ({...state, ...payload}) ,
  [createdBy.fail]: (state, payload) => ({errors: payload})
}, {});


import {read as readJobs} from '../modules/jobs/tasks/crud';
import {createdBy} from '../modules/jobs/actions';

dispatch(
  readJobs(
    {created_by: 122},
    {actions: createdBy}
  )
);
```