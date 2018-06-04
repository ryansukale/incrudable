// TODO: Refactor this

export default {
  getJSON(url) {
    return fetch(url).then(response => response.json());
  },
  postJSON(url, { body, ...options }) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(options.body),
      ...options
    }).then(response => response.json());
  },
  putJSON(url, { body, ...options }) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(options.body),
      ...options
    }).then(response => response.json());
  },
  delJSON(url) {
    return fetch(url).then(response => response.json());
  }
};
