incrudable
----

Wait for it...

```js
// If you are using redux-thunk
import incrudable from 'incrudable/redux-thunk';

// If you are using redux-observable
// import incrudable from 'incrudable/redux-observable';

// Define the configuration for your resources as follows
const resources = {
  albums: {
    name: 'albums',
    singular: 'album',
    basePath: '/data/albums'
  }
};

export * from incrudable(resources);

/** This returns a object with the following properties
{
  albums: {
    actions: {
      create: {success: f() , error: f(), wait: f()}
      read: {success: f() , error: f(), wait: f()}
      update: {success: f() , error: f(), wait: f()}
      del: {success: f() , error: f(), wait: f()}
      list: {success: f() , error: f(), wait: f()}
    }
    thunks: {
      create: f(),
      read: f(),
      update: f(),
      del: f(),
      list: f()
    }
  }
}
*/

// You can use redux to dispatch

import {albums} from 'modules/resources'
const {thunks, actions} = albums;

const payloadForCreate = {body: {title: 'Elements of Life', genre: 'trance'}};
dispatch(
  thunks.create(payloadForCreate, {actions: actions.create})
);

const payload = {query: {page: 10}};
dispatch(
  thunks.list(payloadForList, {actions: actions.list})
);

import createActionGroup from 'incrudable/lib/createActionGroup';

// Create and export your application specific action group
export const filterAlbumActions = createActionGroup('FILTER_BY_GENRE');

// Reuse the list thunk, but dispatch your custom action groups
const payload = {query: {genre: 'trance'}};
dispatch(
  thunks.list(payloadForList, {actions: filterAlbumActions})
);

In your reducers, you can listen as follows
// import {albums} from 'modules/albums/resources'
// import filterAlbumActions from 'modules/albums/filter';

// Plain old swich based reducers
function albumsReducer(state, {action, payload}) {
  switch (action) {
    case albums.actions.create.success:
      return {latest: payload};
    case albums.actions.create.error:
      return {errors: payload};
    case albums.actions.create.wait:
      return {isLoading: true};

    // Handle your custom action group
    case filterActions.success:
      return {by_genre: payload};
    case filterActions.error:
      return {errors: payload};
    case filterActions.wait:
      return {isFiltering: true};
  }
}

**/

```

To create tooling for resources individually

```js
// With thunks
const { actions, thunks } = incrudable.fromResource(albums);

// With epics
const { actions, epics } = incrudable.fromResource(albums);
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
  createAlbum: f() ...,
  readAlbum: f() ...,
  updateAlbum: f() ...,
  delAlbum: f() ...,
  listAlbums: f() ...,
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
  basePath: '/api/albums',
  operations: ['create', 'read', 'update', 'del', 'list']
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
    {
      body: {title: 'By the rivers of Babylon'}
      params: {id: 10}
    },
    {actions: jobActions.createdByUser}
  )
);
```

```
Additional Configuration
// If your endpoint is not restful, set `restful` as false and provide a `routes` hash and your tasks will use POST instead of restful methods




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