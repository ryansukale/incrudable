export default function onJsonApiResponse({actions, dispatch, onError, done}, request, response) {
  const {errors, data} = response;
  if (errors) {
    onError({actions, dispatch, done}, request, errors);
    return;
  }

  const payload = {request, response};
  dispatch(actions.success(payload));
  done && done(null, payload);
}

export default function onJsonApiError({actions, dispatch, done}, request, response) {
  const payload = {request, errors};
  actions.fail && dispatch(actions.fail(payload));
  done && done(payload);
}
