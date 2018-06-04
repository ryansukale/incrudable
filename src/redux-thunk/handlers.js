export function onJsonApiResponse(
  { actions, dispatch, onError, done },
  request,
  response
) {
  const { errors } = response;
  if (errors) {
    onError({ actions, dispatch, done }, request, errors);
    return undefined;
  }

  const payload = { request, response };
  dispatch(actions.success(payload));
  if (done) {
    done(null, payload);
  }
  return undefined;
}

export function onJsonApiError({ actions, dispatch, done }, request, errors) {
  const payload = { request, errors };
  if (actions.failure) {
    dispatch(actions.failure(payload));
  }
  if (done) {
    done(payload);
  }
}
