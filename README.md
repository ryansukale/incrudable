incrudable
----

Wait for it...

Define a set of resources as follows
const resources = {
  albums: {
    basePath: '/data/albums',
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
const {albums, users} = incrudable(resources);
```

To create tooling for resources individually
```js
// With thunks
const { actions, thunks } = incrudable.fromResource(resources.albums);

// With epics
const { actions, epics } = incrudable.fromResource(resources.albums);
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
  createAlbums: ...,
  readAlbums: ...,
  updateAlbums: ...,
  delAlbums: ...,
}

-----
```js
// modules/jobs/actions.js
export const createdByUser = createActionGroup('JOBS_CREATED_BY_USER');

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
  [createdByUser.wait]: (state, payload) => ({isLoading: true}),
  [createdByUser.success]: (state, payload) => payload,
  [createdByUser.error]: (state, payload) => ({errors: payload})
}, {});

// modules/jobs/tasks/crud.js
export default createTasks({
  resource: 'albums',
  singular: 'album',
  routes: {
    create: '/api/albums',
    read: '/api/albums/{id}'
    update: '/api/albums/{id}',
    del: '/api/albums/{id}',
    list: '/api/albums'
  }
});

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

```
Additional Configuration
// If your endpoint is not restful, set `restful` as false and your tasks will use POST instead of restful methods

const config = {restful: false};
export default createTasks({
  resource: 'albums',
  singular: 'album',
  restful: false
  routes: {
    create: '/api/jobs/create',
    read: '/api/jobs/read'
    update: '/api/jobs/update',
    del: '/api/jobs/del',
    list: '/api/jobs/list'
  }
});
```