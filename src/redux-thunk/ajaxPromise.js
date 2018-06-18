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

export default {
  getJSON(url) {
    return ajax(url);
  },
  postJSON(url, { body, ...options }) {
    return ajax(url, {
      method: 'POST',
      body: JSON.stringify(options.body),
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
  delJSON(url) {
    return ajax(url, {
      method: 'DELETE'
    });
  }
};
