export function onJsonApiResponse({actions, dispatch, onError, done}, request, response) {
  const {errors, data} = response;
  if (errors) {
    onError({actions, dispatch, done}, request, errors);
    return undefined;
  }

  const payload = {request, response};
  dispatch(actions.success(payload));
  done && done(null, payload);
  return undefined;
}

export function onJsonApiError({actions, dispatch, done}, request, response) {
  const payload = {request, errors};
  actions.failure && dispatch(actions.failure(payload));
  done && done(payload);
}
