import * as Rx from 'rx-lite-dom-ajax';

function getJsonAjaxStream(settings) {
  return Rx.DOM.ajax({
    responseType: 'json',
    ...settings
  }).map(({response}) => response);
}

export default {
  getJSON(url, options) {
    return getJsonAjaxStream({
      method: 'GET',
      ...options,
      url
    });
  },
  postJSON(url, { body, ...options }) {
    return getJsonAjaxStream({
      url,
      method: 'POST',
      body,
      ...options,
    });
  },
  putJSON(url, { body, ...options }) {
    return getJsonAjaxStream({
      url,
      method: 'PUT',
      body,
      ...options,
    });
  },
  delJSON(url, options) {
    return getJsonAjaxStream({
      url,
      method: 'DELETE',
      responseType: undefined,
      ...options
    });
  }
}
