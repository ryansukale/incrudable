export default {
  getJSON(url) {
    return fetch(url).then((response) => response.json());
  },
  postJSON(url, {body, ...options}) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options
    }).then((response) => response.json());
  }
}
