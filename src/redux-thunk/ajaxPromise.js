import 'whatwg-fetch';

export const DEAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
};

const identity = data => data;
let getHeaders;

function onResponse(response) {
  if (response.ok) {
    return response.json().then(json => {
      return json;
    });
  }

  if (response.headers.get('Content-Type').indexOf('json') !== -1) {
    return response
      .json()
      .then((error) => Promise.reject(error));
  }

  return Promise.reject(response);
}

export function ajax(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...DEAULT_HEADERS,
      ...getHeaders(),
      ...options.headers
    }
  }).then(onResponse);
}

export default function ajaxPromise(customGetHeaders = identity) {
  getHeaders = customGetHeaders;
  return {
    getJSON(url, options) {
      return ajax(url, options);
    },
    postJSON(url, { body, ...options }) {
      return ajax(url, {
        method: 'POST',
        body: JSON.stringify(body),
        ...options
      });
    },
    putJSON(url, { body, ...options }) {
      return ajax(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        ...options
      });
    },
    delJSON(url, options) {
      return ajax(url, {
        method: 'DELETE',
        ...options
      });
    }
  }
}
