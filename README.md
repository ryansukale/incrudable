incrudable
----

Automagically generate thunks or epics for your applications CRUD routes.

---

### Setup
```
yarn add incrudable
// OR
npm install incrudable --save
```

---

### Philosophy
Having to learn a new library is often a pain. While building incrudable, one of my goals was to allow developers to use all their existing knowledge on redux-thunks and thunks-observables, so it should be 100% compatible with existing codebases, and let this library just provide a bunch of utility functions to reduce boilerplate. 
Use as little or as much as you need of this library. Everything is optional.

---

### What problem is it trying to solve
Assume we can define a crud resource that supported the following operations.
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
For the sake of conversation, lets take the first operation - `create`. When a user interacts with the application to create a song, typically, there are 3 meaningful events that a store can handle in the below sequence(and perhaps its relevant to the UI as well)

- 1 - Loading/Waiting - just before the request is made
- 2 - Success - when a successful response is received
- 3 - Failure - when an error occurs

This implies that for the `create` operation alone, your application needs to dispatch 3 actions in a sequence. This same logic applies to all the operations of the song resource. As well as all the other resources within your application.

Incrudable attempts to solve this problem of writing boilerplate code (actions, thunks, epics) by providing you with thunk and epic generators that dispatch events in the sequence mentioned above. At the the time of writing, this library exposes two implementations of generators using `redux-thunks` and `redux-observable`, all the while exposing the exact same interface.

```js
// File: /modules/thunks/songs.js
import incrudable from 'incrudable/lib/redux-thunks';
OR
import incrudable from 'incrudable/lib/redux-observable';
// Define the configuration for your resources as follows
const resource = {
  name: 'songs',
  operations: {
    create: '/api/albums/:id/songs',
    read: '/api/albums/:id/songs/:songId'
    update: '/api/albums/:id/songs/:songId',
    del: '/api/albums/:id/songs/:songId',
    list: '/api/albums/:id/songs',
    customTask: {
      method: 'GET',
      url: '/api/albums/:id/songs'
    }
  }
}

const thunks = incrudable.fromResource(songs);
export default thunks;

/** This returns an object with the following properties corresponding to crud operations
{
  create: f(), // Thunks/Tasks
  read: f(),
  update: f(),
  del: f(),
  list: f(),
  customTask: f()
}
*/
```

The hash of functions above are called `tasks`. If you are using `redux-thunk`, they are simply plain ol thunks. I have only chosen to call them as `tasks` because their usage is the same even with `redux-observable` so it made sense to go with generic terminology. They do have some additional features, which are covered in the examples below.

Below is an example of you can use one of these tasks.

```js
// From within your react component
// File: components/songs/Create.jsx
import {songs} from 'modules/thunks/songs';

class MyClass extends React.Component {
    onCreate = () => {
        ....
        dispatch = ...// Assume you have access to the redux dispatch here, perhaps via context
        const payload = {body: {title: 'Elements of Life', genre: 'trance'}};
        dispatch(songs.create(payload));
    }
    render() {
        ...All the good stuff...
    }
}

```

And here's how you could use them in your reducer.

```js
// File: modules/songs/reducer.js
import {songs} from 'modules/songs/thunks';

// Your reducer now automatically has access to three events on each crud operation of the resource
function songssReducer(state, {action, payload}) {
  switch (action) {
    case songs.create.success: // OR 'CREATE_SONGS_SUCCESS'
      return {latest: payload};
    case songs.create.failure: // OR 'CREATE_SONGS_FAILURE' 
      return {errors: payload};
    case songs.create.wait:  // OR 'CREATE_SONGS_WAIT'
      return {isLoading: true};
    ...
    ...
    ...
    case songs.customTask.success:
      return {...};
    case songs.customTask.failure:
      return {...};
    case songs.customTask.wait:
      return {...};
  }
}
```
---

### Is there anything special about tasks?

If you notice in the example above, the exported tasks have 2 special characteristics
- The format of the payload it expects.
- The attributes that are available as event names to be used in the reducer

Both of these are covered in the following sections.

---

### Payload format
In order to provide the simplest interface while making minimal assumptions about your business logic, a task expects a payload to be an object of the following format
```
const payload = {
    body: {}, // Required for operations that use the POST and PUT methods
    params: {}, // Key value pairs provided here will be mapped to url params
    query: {} // A hash that will be convered to a query string and appended to the url
}
```

---

### Customizing operations
Each named operation of a resources corresponds to an endpoint url. By default, `incrudable` use a few well known operation names to guess their http method
|operation name | method|
|---|---|
|create| POST|
|read| GET|
|update| PUT|
|del| DELETE|
|list| GET|

You can also create custom operation names and specify their http methods and url. e.g.
```js
const resource = {
  name: 'songs',
  operations: {
    create: '/api/albums/:id/songs',
    ....
    ....
    sortedList: { // Custom operation name
      url: '/api/albums/:id/songs',
      method: 'GET'
    }
  }
}
```

---

Often times, your application needs to invoke the same endpoint, but for the different user interaction. For example.
Given a list endpoint `albums/:id/songs`, its quite possible that your business logic demands to perform sorting or filtering as well. Since the operation of `list` is the same but the user interaction is different, custom actions can let you differentiate between the different types of calls.

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

#### Advanced configuration
const resources = {
  songs: {
    name: 'songs',
    operations: {
      create: '/api/albums/:id/songs',
      read: '/api/albums/:id/songs/:songId'
      update: '/api/albums/:id/songs/:songId',
      del: '/api/albums/:id/songs/:songId',
      sortedList: {
        url: '/api/albums/:id/songs',
        method: 'GET',
        actions: createActionGroup('SORTED_SONGS'),
        beforeSubmit: data => data,
        onSuccess: () => ...., // Custom handler
        onFailure: () => .... // Custom handler
      }
    }
  }
};
