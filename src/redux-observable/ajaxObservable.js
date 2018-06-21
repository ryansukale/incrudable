import * as Rx from 'rx-lite-dom-ajax';

export const DEAULT_HEADERS = {
  'Accept': 'application/json',
  'Content-Type': 'application/json; charset=utf-8'
};

const identity = data => data;
let getHeaders;

function getJsonAjaxStream(settings) {
  return Rx.DOM.ajax({
    responseType: 'json',
    ...settings,
    headers: {
      ...DEAULT_HEADERS,
      ...getHeaders(),
      ...settings.headers
    }
  }).map(({response}) => response);
}

export default function ajaxObservable(customGetHeaders = identity) {
  getHeaders = customGetHeaders;

  return {
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
}
