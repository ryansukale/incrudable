import createAction from 'redux-actions/lib/createAction';

import createActionType from './createActionType';

const DEFAULT_STATUS_TYPES = ['success', 'failure', 'wait'];

/**
 * Creates wait, succcess and fail actions by default
 */
export default function createActionGroup(options, statusTypes = DEFAULT_STATUS_TYPES) {
  let base, prefix;
  if (typeof options === 'string') {
    base = options;
  } else {
    base = options.base;
    prefix = options.prefix;
    statusTypes = options.statusTypes || DEFAULT_STATUS_TYPES;
  }

  return statusTypes.reduce(function (acc, type) {
    acc[type] = createAction(
      createActionType(base, {prefix, suffix: type})
    );
    return acc;
  }, {});
}
