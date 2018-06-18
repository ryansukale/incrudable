import fetch from 'whatwg-fetch';

const DEAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
};

function onResponse(response) {
  if (response.ok) {
    return response.json();
  }

  if (response.headers.get('Content-Type').indexOf('json') !== -1) {
    return response
      .json()
      .then((error) => Promise.reject(error));
  }

  return Promise.reject(response);
}

export function ajax(url, options) {
  return fetch(url, {
    ...options,
    headers: {
      ...DEAULT_HEADERS,
      ...options.headers
    }
  }).then(onResponse);
}

const identity = data => data;

export default function ajaxPromise(getHeaders = identity) {
  return {
    getJSON(url) {
      return ajax(url, {
        headers: getHeaders()
      });
    },
    postJSON(url, { body, ...options }) {
      return ajax(url, {
        method: 'POST',
        body: JSON.stringify(options.body),
        headers: getHeaders()
        ...options
      });
    },
    putJSON(url, { body, ...options }) {
      return ajax(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: getHeaders()
        ...options
      });
    },
    delJSON(url) {
      return ajax(url, {
        method: 'DELETE',
        headers: getHeaders()
      });
    }
  }
}

// export default {
//   getJSON(url) {
//     return ajax(url);
//   },
//   postJSON(url, { body, ...options }) {
//     return ajax(url, {
//       method: 'POST',
//       body: JSON.stringify(options.body),
//       ...options
//     });
//   },
//   putJSON(url, { body, ...options }) {
//     return ajax(url, {
//       method: 'PUT',
//       body: JSON.stringify(body),
//       ...options
//     });
//   },
//   delJSON(url) {
//     return ajax(url, {
//       method: 'DELETE'
//     });
//   }
// };
