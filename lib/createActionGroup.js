import createAction from 'redux-actions/lib/createAction';

import createActionType from './createActionType';

const DEFAULT_STATUS_TYPES = ['success', 'fail', 'wait'];

/**
 * Creates wait, succcess and fail actions by default
 */
export default function createActionGroup(eventBase, statusTypes = DEFAULT_STATUS_TYPES, prefix) {
  return statusTypes.reduce(function (acc, type) {
    acc[type] = createAction(
      createActionType(eventBase, {prefix, suffix: type})
    );
    return acc;
  }, {});
}