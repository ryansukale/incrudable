![incrudable javascript library](logo_incrudable.svg)

## incrudable

_Automagically generate thunks or epics for your application's CRUD routes._

---

```
yarn add incrudable
// OR
npm install incrudable --save
```

---

At this time, this library exposes two implementations for creating CRUD resources - one using `redux-thunk` and another using `redux-observable`.

**NOTE**: If you are using `redux-observable`, this library relies on Rxjs 6+ which has several differences from Rxjs 5. Please see the [Rxjs repository](https://github.com/ReactiveX/rxjs) for more information on backward compatibility and migration.

---

### Philosophy

Having to learn a new library is often a pain. While building incrudable, one of my goals was to enable developers to use all their existing knowledge of `redux-thunks` or `redux-observables`( so it should be 100% compatible with existing codebases), and let this library act as a complimentary set of utility functions to reduce boilerplate.

Use as little or as much of this library as you need. There are a few conventions to follow if you intend to use the richer functions like the `incrudable` constructor and `fromResource`. Almost everything else plug and play and highly customizable.

---

### What problem is this library trying to solve?

Assume we can define a crud resource that supports the following operations.

```js
const resources = {
  songs: {
    name: 'songs', // Unique name required to create namespaced action strings
    operations: { // A hash of crud operations and their routes
      create: '/api/albums/:id/songs',
      read: '/api/albums/:id/songs/:songId'
      update: '/api/albums/:id/songs/:songId',
      del: '/api/albums/:id/songs/:songId',
      list: '/api/albums/:id/songs'
    }
  }
};
```

For the sake of conversation, lets take the first operation - `create`. When a user interacts with the application to create a song, usually, there are 3 meaningful events that a store can handle in the below sequence(and perhaps these events are relevant to the UI as well)

- 1 - Loading/Waiting - just before the request is made
- 2 - Success - when a successful response is received
- 3 - Failure - when an error occurs

This implies that for the `create` operation alone, your application needs to dispatch 3 actions in a sequence. This same logic applies to all the operations of a resource. As well as all the other resources within your application.

Incrudable attempts to solve this problem of writing boilerplate code (actions, thunks, epics) by providing you with thunk and epic generators that dispatch events in the sequence mentioned above. At the the time of writing, this library exposes two implementations of generators using `redux-thunks` and `redux-observable`, all the while exposing the same interface.

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
  create: f(), // Tasks / Thunks
  read: f(),
  update: f(),
  del: f(),
  list: f(),
  customTask: f()
}
*/
```

The hash of functions above are called `tasks`. If you are using `redux-thunk`, they are just plain ol thunks. I have only chosen to call them as `tasks` because their usage is the same even with `redux-observable` so it made sense to go with generic terminology. The main feature of a task is that it has a lifecycle and dispatches events at various points in that lifecycle. They do have some additional features, which are covered in the examples below.

---

### Setup

Setting up `redux-thunk` is done as per [their documentation](https://github.com/reduxjs/redux-thunk#installation). And since for the `redux-thunk` implementation, tasks are simply thunks, you can start using them right away in your code the way you use your own thunks.

If you are using `redux-observable`, you need epics which can be setup as middleware for the store. Therefore each task created via `incrudable/lib/redux-observable` has a special property called `epic` that you can use during your middleware integration. It also exports a top level epic which can be used as a root epic, which is the result of combining all the child epics.

The following example demonstrates the two ways you can access the generated epics.

```js
import { combineEpics } from 'redux-observable';
import incrudable from 'incrudable/lib/redux-observable';

const songs = {
  name: 'songs',
  operations: {....}
};

const albums = {
  name: 'albums',
  operations: {....}
};

const sources = incrudable({songs, albums});
// sources.songs.create, sources.songs.read ... : Tasks
// sources.albums.create, sources.albums.read : Tasks
// sources.epic : Root level epic by combining all sub epics
export rootEpic = sources.epic;

// This is equivalent to

const songTasks = incrudable.fromResource(songs);
// songTasks.songs.create, sources.songs.read ... : Tasks
const albumTasks = incrudable.fromResource(albums);
// albumTasks.albums.create, sources.albums.read : Tasks

export rootEpic = combineEpics(songTasks.epic, albumTasks.epic);
```

Once you have a rootEpic, you can integrate it by following the official `redux-observable` [docs](https://redux-observable.js.org/docs/basics/SettingUpTheMiddleware.html).

Below is an example of how you can use one of these tasks.

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

All of these are covered in the following sections.

---

### Payload format

In order to provide a simple interface while making minimal assumptions about your business logic, a task expects a payload to be an object of the following format

```
const payload = {
    body: {}, // An optional hash, which is only required for operations that use the POST and PUT methods
    params: {}, // An optional hash of key value pairs provided here will be mapped to url params
    query: {} // An optional hash that will be converted to a query string and appended to the url
}
```

---

### Customizing operations

Each named operation of a resources corresponds to an endpoint url. By default, `incrudable` uses a few well known operation names to determine their http method.

| operation name | method |
| -------------- | ------ |
| create         | POST   |
| read           | GET    |
| update         | PUT    |
| del            | DELETE |
| list           | GET    |

You can also create custom operation names and specify their http methods and url. e.g.

```js
// modules/sources.js
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

export default incrudable({ songs });
```

Your reducer can then listen to the events as

```js
import { songs } from modules/sources;

function reducer(state, {action, payload}) {
    case songs.sortedList.success:
      return {...};
    case songs.sortedList.failure:
      return {...};
    case songs.sortedList.wait:
      return {...};
}

// OR If you prefer to use strings
function reducer(state, {action, payload}) {
    case 'SORTEDLIST_SONGS_SUCCESS':
      return {...};
    case 'SORTEDLIST_SONGS_FAILURE':
      return {...};
    case 'SORTEDLIST_SONGS_WAIT':
      return {...};
}
```

But what if you want to use strings but dont like the names of the strings that are generated by default? Simple, you can provide a custom actions hash in the configuration with the event names of your choice. You just have to make sure those strings are unique within your application, just like you'd do if you werent using this library.

```js
const resource = {
  name: 'songs',
  operations: {
    sortedList: {
      url: '/api/albums/:id/songs',
      method: 'GET',
      actionsTypes: {
        // Custom event names hash for the lifecycle events
        wait: 'SORTED_SONGS_LOADING',
        success: 'SORTED_SONGS_DONE',
        failure: 'SORTED_SONGS_ERROR'
      }
    }
  }
};
```

The custom actionTypes hash must have 3 keys - `wait`, `success`, and `failure` since these are the action names that that will be called in the lifecycle of the whenever the thunk/epic is invoked by your application.

The nice thing about operation customization is that they can be done for the well-known operations like `create`, `read`, `update`, `del`, and `list` and as well. For example

```js
const resource = {
  name: 'songs',
  operations: {
    create: {
      url: '/api/albums/:id/songs',
      method: 'POST',
      actionsTypes: {
        // Custom event names hash for the lifecycle events
        wait: 'CUSTOM_SONGS_LOADING',
        success: 'CUSTOM_SONGS_DONE',
        failure: 'CUSTOM_SONGS_ERROR'
      }
    }
  }
};
```

---

### Lifecycle hooks

Apart from letting you customize the actions and methods, the library also lets you add hooks into the lifecyce - beforeSubmit, onSuccess and onFailure to tackle custom scenarios.

#### beforeSumit

A function that receives the data of the request and must return a value that is treated as the request. The beforeSubmit function is a great place to

1.  Handle custom parsing of request data e.g. if you'd like to create derived parameters based on user input.
2.  Debounce/delay expensive operations

Due to the inherent difference in implemenations of `redux-thunk` and `redux-observable`, the signature of the beforeSubmit function is slightly different. An simple example for both has been provided belowl.

##### Usage with redux-thunks,

**Signature**:
`beforeSubmit(object)`

**Arguments**
`object`: This is same as the request that the thunk was called with.

**Return value**

This can be one of

- An object. By default, the original request payload is returned.
- A Promise - Which resolves with an object which represents the request.

The following examples demonstrate the using a debounced beforeSubmit for both `redux-thunks` and `redux-observables`

```js
// Usage with redux-thunks
import pDebounce = from 'p-debounce';

// perhaps you dont want to send the request too often
// and want to transform the original params before they can get processed
const beforeSubmit = pDebounce((request) => {
  // Do expensive stuff here if necessary
  // Return a custom payload or return the original request itself
  return {
    ...request,
    params: {
      query: {term: request.query.term.trim()}
    }
  };
}, 200);

const resource = {
  name: 'songs',
  operations: {
    search: {
      url: '/api/search',
      method: 'GET',
      beforeSubmit
  }
};
```

##### Usage with redux-observable,

**Signature**:
`beforeSubmit(stream)`

**Arguments**
`stream`: This is an observable stream that only contains data specific to this task.

**Return value**
This must be

- An observable stream whose data represents the request to be processed.

The example below demonstrates both debouncing as well as parameter transformation. Since you have access to the request stream, you are free to do whatever you want as long as you return a request stream for further processing the lifecycle.

```js
// Import Rxjs 6 operators
import { debounceTime, map } from 'rxjs/operators';

const beforeSubmit = request$ => {
  // Return a custom payload after a debounce
  // Or simply the original request object
  return request$.pipe(
    debounceTime(200),
    map(request => {
      return {
        ...request,
        params: {
          query: {term: request.query.term.trim()}
        }
    })
  );
};

const resource = {
  name: 'songs',
  operations: {
    search: {
      url: '/api/search',
      method: 'GET',
      beforeSubmit
  }
};
```

---

#### Custom onSuccess and onFailure

Just like `onSubmit`, you can pass custom onSuccess and onFailure handlers. The following examples demonstrate their usage.

##### Usage with redux-thunks

```js
// Custom Success handler
export function customOnSuccess(
  { actions, dispatch },
  request,
  response
) {
  // You have access to the original request payload and the dispatch.
  // Since we are inside a thunk, you can dispatch as many times as you may please.
  const payload = { request, response };
  dispatch(actions.success(payload));
}

// Custom Error handler
export function customOnFailure(
  { actions, dispatch },
  request,
  response
) {
  // You have access to the original request payload and the dispatch.
  // Since we are inside a thunk, you can dispatch as many times as you may please.
  const payload = {
    request,
    errors: response.errors || response
  };

  dispatch(actions.failure(payload));
}

const resource = {
  name: 'songs',
  operations: {
    search: {
      url: '/api/search',
      method: 'GET',
      onSuccess: customOnSuccess,
      onFailure: customOnFailure
  }
};
```

##### Usage with redux-observable

The success and failure handlers keep in line with the redux-observable's philosophy of actions in -> actions out. This is different from `redux-thunks` because an epic can only return 1 action per invocation.

```js
export function customOnSuccess({ actions }, request, response) {
  const payload = { request, response };
  return actions.success(payload); // OR You can return a custom action that will get dispatched
}

export function customOnFailure({ actions }, request, response) {
  const payload = {
    request,
    errors: response.errors || response
  };
  return actions.failure(payload);
}

const resource = {
  name: 'songs',
  operations: {
    search: {
      url: '/api/search',
      method: 'GET',
      onSuccess: customOnSuccess,
      onFailure: customOnFailure
  }
};
```

Notice that the way you configure your resource to use the custom handlers is exactly the same, irrespective of `redux-thunk` or `redux-observable`. This gives you the flexibility of using both, the frameworks in your application at the same time, if you choose to do so.

---

#### incrudable(resources, [config])

Acceps a hash of resources and generates corresponding tasks.

```js
import incrudable from 'incrudable/lib/redux-thunk';
// OR
import incrudable from 'incrudable/lib/redux-observable';

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
  },
  songs: {
    name: 'songs',
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

An optional config lets you inject dependencies like ajax and custom headers

- **config.ajax**: A hash of methods that will be used to execute your ajax requests. Internally, the framework uses the whatwg fetch for the `redux-thunks` implementation, and `rx-lite-dom-ajax` for `redux-observable` implementation respectively.

```js
{
  getJSON: () { ... },
  postJSON: () { ... },
  putJSON: () { ... },
  delJSON: () { ... }
}
```

- **config.getHeaders**: This function will get invoked during every request and the returned hash will be sent in the headers. This is a great place to put code for sending auth tokens, csrf tokens etc.

---

#### fromResource(resource, config)

Used to create tasks for a single resource. `resource` is a single resource. `config` is the same as the one for `incrudable`.

For file size sensitive imports, you can directly use the version based on your library.
e.g.

```js
// For thunks
import fromResource from 'incrudable/lib/redux-thunks/fromResource';
// For epics
import fromResource from 'incrudable/lib/redux-observable/fromResource';
OR;
const source = incrudable.fromResource(songs);
```

---

#### createActionGroup(base, [actionNames])

Creates a group of action creators using the `redux-actions` library. By default it creates three action creators `wait`, `success` and `failure`.

```js
import createActionGroup from 'incrudable/lib/fromResource';
// modules/jobs/actions.js
export const groupOne = createActionGroup('ALBUMS_CREATED_BY_USER');
/*
This generates an object with three named action creators
groupOne = {
  success: f()...
  failure: f() ...
  wait: f()...
};
*/

export const groupTwo = createActionGroup('FILTER_SONGS', ['pending', 'done', 'error']);
/*
groupTwo = {
  done: f()...
  pending: f() ...
  error: f()...
};
*/

// Within a reducer you can listen to these actions
// modules/jobs/reducer.js
import {createdByUser} from '../modules/jobs/actions';

function reducer(state, {action, payload}) {
  switch (action) {
    case groupOne.success:
      return {latest: payload};
      ....
      ....
    case groupTwo.pending:
      return {isLoading: true};
  }
}
```

### License

MIT
