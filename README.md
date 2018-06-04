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
    operations: {
      create: '/api/albums',
      read: '/api/albums/:id'
      update: '/api/albums/:id',
      del: '/api/albums/:id',
      list: '/api/albums'
    }
  }
};

export * from incrudable(resources);

/** This returns an object with the following properties
{
  create: f(), // Thunks
  read: f(),
  update: f(),
  del: f(),
  list: f()
}
*/

// You can use redux to dispatch

import {albums} from 'modules/albums/resources'

// ---------

const payload = {body: {title: 'Elements of Life', genre: 'trance'}};
dispatch(
  albums.create(payload, {actions: actions.create})
);

// ---------

const payload = {query: {page: 10}};
dispatch(
  albums.list(payload, {actions: actions.list})
);

```

---

You can reuse thunks and export custom actions. This comes in handy when you want to use perform the operation of a thunk like fetching a list of things when filtering, sorting, etc but want to dispatch custom actions based on business your business logic / query criteria.

```js
// modules/albums/filter.js
import createActionGroup from 'incrudable/lib/createActionGroup';

import {albums} from 'modules/albums/resources';

// Create and export your application specific action group
export const filterAlbumActions = createActionGroup('FILTER_BY_GENRE');

// Reuse the list thunk, but dispatch your custom action groups
const payload = {query: {genre: 'trance'}};
dispatch(
  albums.list(payload, {actions: filterAlbumActions})
);

// In your reducers, you can listen as follows
import {albums} from 'modules/albums/resources';
import filterAlbumActions from 'modules/albums/filter';

const {create} = albums;

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

#### incrudable

Acceps a hash of resource configurations and generates corresponding thunks and actions

```js
import incrudable from 'incrudable/redux-thunk';

// Define the configuration for your resources as follows
const resources = {
  albums: {
    name: 'albums',
    singular: 'album',
    operations: {
      create: '/api/albums',
      read: '/api/albums/:id'
      update: '/api/albums/:id',
      del: '/api/albums/:id',
      list: '/api/albums'
    }
  },
  songs: {
    name: 'songs',
    singular: 'song',
    operations: {
      create: '/api/albums/:id/songs',
      read: '/api/albums/:id/songs/:song-id'
      update: '/api/albums/:id/songs/:song-id',
      del: '/api/albums/:id/songs/:song-id',
      list: '/api/albums/:id/songs'
    }
  }
};

export default incrudable(resources);

```

---

#### incrudable.fromResource

To create tooling for resources individually

```js
const albumsResource = incrudable.fromResource(albums);
```

Available as an individual import as `import fromResource from 'incrudable/lib/fromResource'`;

---

#### incrudable.createActionGroup

```js
// modules/jobs/actions.js
export const createdByUser = incrudable.createActionGroup('ALBUMS_CREATED_BY_USER');

/**
This generates an object with three named actions
createdByUser = {
  success: f()...
  failure: f() ...
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
    case createdByUser.failure:
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
  operations: {
    create: '/api/albums',
    read: '/api/albums/:id'
    update: '/api/albums/:id',
    del: '/api/albums/:id',
    list: '/api/albums'
  }
});

// tasks/initDashboard.js
import albums from '../modules/albums/tasks/crud';
import albumFilterActions from '../modules/albums/actions';

dispatch(
  albums.list(
    {query: {created_by: 122}}
    {actions: albumFilterActions.createdByUser}
  )
);

dispatch(
  albums.update(
    {
      body: {title: 'By the rivers of Babylon'}
      params: {id: 10}
    }
  )
);
```

Available as an individual import as `import createCrudTasks from 'incrudable/lib/createCrudTasks';`

---
