
function getEpicCreator(ajaxMethodName, config, { ajax }) {
  const {
    url,
    actions,
    onSuccess = onJsonApiResponse,
    onFailure = onJsonApiError
  } = config;

  function waitAction(request, done) {
    const {actions} = config;
    return actions.wait(request));
  }

  function success(action$) {
    action$
      .ofType(actions.wait)
      .switchMap(({payload}) => ajax[ajaxMethodName](fullUrl, payload))
      .map((response) => onSuccess(handlerConfig, request, response));
  }

  return waitAction;
}
