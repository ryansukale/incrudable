import createAction from 'redux-actions/lib/createAction';

import createActionType from './createActionType';

const DEFAULT_STATUS_TYPES = ['success', 'fail', 'wait'];

/**
 * Creates wait, succcess and fail actions by default
 */
export default function createActionGroup({
  base, 
  prefix,
  statusTypes = DEFAULT_STATUS_TYPES,
}) {
  return statusTypes.reduce(function (acc, type) {
    acc[type] = createAction(
      createActionType(base, {prefix, suffix: type})
    );
    return acc;
  }, {});
}
