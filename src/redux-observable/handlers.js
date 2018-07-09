export function onJsonApiResponse({ actions, onFailure }, request, response) {
  if (response.errors) {
    return onFailure({ actions }, request, response);
  }
  const payload = { request, response };
  return actions.success(payload);
}

export function onJsonApiError({ actions }, request, response) {
  const payload = {
    request,
    errors: response.errors || response
  };
  return actions.failure(payload);
}
