export function onJsonApiResponse(
  { actions, dispatch, onFailure, done },
  request,
  response
) {
  const { errors } = response;
  if (errors) {
    onFailure({ actions, dispatch, done }, request, response);
    return undefined;
  }

  const payload = { request, response };
  dispatch(actions.success(payload));
  if (done) {
    done(null, payload);
  }
  return undefined;
}

export function onJsonApiError({ actions, dispatch, done }, request, response) {
  const payload = {
    request,
    errors: response.errors || response
  };
  if (actions.failure) {
    dispatch(actions.failure(payload));
  }
  if (done) {
    done(payload);
  }
}
