import * as Rx 'rx-lite-dom-ajax';

function getJsonAjaxStream(settings) {
  return Rx.DOM.ajax({
    ...settings,
    responseType: 'json'
  }).map(({response}) => response);
}

export default {
  getJSON(url, options) {
    return getJsonAjaxStream({
      method: 'GET',
      ...options
    });
  },
  postJSON(url, { body, ...options }) {
    return getJsonAjaxStream({
      method: 'GET',
      body,
      ...options
    });
  }
}
