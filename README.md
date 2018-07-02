incrudable
----

Automagically generate thunks or epics for your applications CRUD routes.

#### Philosophy
Assume you have crud resource that supported the following operations.
```js
const resources = {
  songs: {
    name: 'songs',
    operations: {
      create: '/api/albums/:id/songs',
      read: '/api/albums/:id/songs/:songId'
      update: '/api/albums/:id/songs/:songId',
      del: '/api/albums/:id/songs/:songId',
      list: '/api/albums/:id/songs'
    }
  }
};
```
Lets take the first operation `create`. When a user interacts with the UI to create a song, ideally, within your application, there are 3 meaningful events that a store can handle in the below sequence

- 1 - Loading/Waiting - just before the request is made
- 2 - Success - when a successful response is received
- 3 - Failure - when an error occurs

This implies that for the `create` operation, your application needs to dispatch 3 actions in a sequence. This same logic applies to all the operations of the song resource. As well as all the other resources within your application.

Incrudable attempts to solve this problem of writing boilerplate code by providing you with thunk and epic generators that enable this sequence of dispatch events. At the time of writing this library exposes two implementations of generators using `redux-thunks` and `redux-observable`.

#### redux-thunks

```js
// File: modules/resources.js
// Define the configuration for your resources as follows
const resources = {
  songs: {
    name: 'songs',
    operations: {
      create: '/api/albums/:id/songs',
      read: '/api/albums/:id/songs/:songId'
      update: '/api/albums/:id/songs/:songId',
      del: '/api/albums/:id/songs/:songId',
      list: '/api/albums/:id/songs'
    }
  }
};
```

```js
// File: /modules/thunks/songs.js
import incrudable from 'incrudable/lib/redux-thunks';
import resources from '/modules/resources';

const thunks = incrudable.fromResource(resources.songs);
export default thunks;

/** This returns an object with the following properties corresponding to crud operations
{
  create: f(), // Thunks
  read: f(),
  update: f(),
  del: f(),
  list: f()
}
*/
```

```js
// From within your react component
// File: components/songs/Create.jsx
import {songs} from 'modules/thunks/songs';

const payload = {body: {title: 'Elements of Life', genre: 'trance'}};
dispatch(songs.create(payload));

// File: components/songs/ListSongs.jsx
const payload = {query: {page: 10}};
dispatch(songs.list(payload));

```

```js
// File: modules/songs/reducer.js
import {songs} from 'modules/songs/thunks';

// Your reducer now automatically has access to three events on each crud operation of the resource
function songssReducer(state, {action, payload}) {
  switch (action) {
    case songs.create.success:
      return {latest: payload};
    case songs.create.failure:
      return {errors: payload};
    case songs.create.wait:
      return {isLoading: true};

    case songs.list.success:
      return {...};
    case songs.list.failure:
      return {...};
    case songs.list.wait:
      return {...};
  }
}
```
---

You can reuse thunks and export custom actions. This comes in handy when you want to perform the operation of a thunk like fetching a list of things when filtering, sorting, etc but want to dispatch custom actions names based on business your business logic / query criteria.

```js
// modules/albums/filter.js
import createActionGroup from 'incrudable/lib/createActionGroup';

import {albums} from 'modules/songs/resources';

// Create and export your application specific action group
// File: modules/songs/actions.js
export default {
    filter: createActionGroup('FILTER_SONGS'),
    sort: createActionGroup('SORT_SONGS')
};
```
```js
// Reuse the list thunk, but dispatch your custom action groups
// File: components/songs/List.jsx
import songActions from 'modules/songs/actions';
const payload = {query: {genre: 'trance'}};
dispatch(
  songs.list(payload, {actions: songActions.filter})
);
```

```js
// File: modules/songs/reducer.js
import {songs} from 'modules/songs/thunks';
import songActions from 'modules/songs/actions';

// Plain old switch based reducers
function albumsReducer(state, {action, payload}) {
  switch (action) {
    case songs.create.success:
      return {latest: payload};
    // ... existing action handlers
    
    // Custom action handlers
    case songActions.filter.success:
      return {by_genre: payload};
    case songActionsfilter.failure:
      return {errors: payload};
    case songActions.filter.wait:
      return {isFiltering: true};
  }
}

```

---



// If you are using redux-observable
// import incrudable from 'incrudable/lib/redux-observable';

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
