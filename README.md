incrudable
----

Wait for it...

```js
// modules/albums/resources.js
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

/** This returns an object with the following properties
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
      createAlbum: f(),
      readAlbum: f(),
      updateAlbum: f(),
      delAlbum: f(),
      listAlbums: f()
    }
  }
}
*/

// You can use redux to dispatch

import {albums} from 'modules/resources'
const {
  thunks: {createAlbum, listAlbums},
  actions
} = albums;

// ---------

const payload = {body: {title: 'Elements of Life', genre: 'trance'}};
dispatch(
  createAlbum(payload, {actions: actions.create})
);

// ---------

const payload = {query: {page: 10}};
dispatch(
  listAlbums(payload, {actions: actions.list})
);

```

---

You can reuse thunks and export custom actions. This comes in handy when you want to use perform the operation of a thunk like fetching a list of things when filtering, sorting, etc but want to dispatch custom actions based on business your business logic / query criteria.

```js
// modules/albums/filter.js
import createActionGroup from 'incrudable/lib/createActionGroup';

import {albums} from 'modules/albums/resources';
const {thunks: {listAlbums}} = albums;

// Create and export your application specific action group
export const filterAlbumActions = createActionGroup('FILTER_BY_GENRE');

// Reuse the list thunk, but dispatch your custom action groups
const payload = {query: {genre: 'trance'}};
dispatch(
  listAlbums(payload, {actions: filterAlbumActions})
);

// In your reducers, you can listen as follows
import {albums} from 'modules/albums/resources';
import filterAlbumActions from 'modules/albums/filter';

const {actions: {create}} = album;

// Plain old switch based reducers
function albumsReducer(state, {action, payload}) {
  switch (action) {
    case create.success:
      return {latest: payload};
    case create.error:
      return {errors: payload};
    case create.wait:
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

```

---

#### incrudable.fromResource

To create tooling for resources individually

```js
// With thunks
const { actions, thunks } = incrudable.fromResource(albums);

// With epics
const { actions, epics } = incrudable.fromResource(albums);
```

---

#### incrudable.createActionGroup

```js
// modules/jobs/actions.js
export const createdByUser = incrudable.createActionGroup('ALBUMS_CREATED_BY_USER');

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

function albumsReducer(state, {action, payload}) {
  switch (action) {
    case createdByUser.success:
      return {latest: payload};
    case createdByUser.error:
      return {errors: payload};
    case createdByUser.wait:
      return {isLoading: true};
  }
}

```

Available as an individual import as `import createActionGroup from 'incrudable/lib/createActionGroup';`

---

#### incrudable.createCrudTasks

```js
// modules/jobs/tasks/crud.js

export default incrudable.createCrudTasks({
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

Available as an individual import as `import createCrudTasks from 'incrudable/lib/createCrudTasks';`

---

#### Additional Configuration


// If your endpoint is not restful, set `restful` as false and provide a `routes` hash and your tasks will use POST instead of restful methods

```js
export default createCrudTasks({
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