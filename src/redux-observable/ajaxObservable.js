import * as Rx from 'rx-lite-dom-ajax';

function getJsonAjaxStream(settings) {
  console.log('settings', settings)
  return Rx.DOM.ajax({
    ...settings,
    responseType: 'json'
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
  }
}
