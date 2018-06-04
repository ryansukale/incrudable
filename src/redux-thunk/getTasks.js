import generateThunk from './generateThunk';

export default function getThunks(resource, actionGroups, config) {
  return Object.keys(actionGroups).reduce((acc, operation) => {
    const url = resource.operations[operation];
    const actions = actionGroups[operation];

    const thunk = generateThunk({
      operation,
      actions,
      url
    }, config);

    Object.keys(actions).reduce((target, actionName) => {
      target[actionName] = actions[actionName];
      return target;
    }, thunk);

    acc[operation] = thunk;

    return acc;
  }, {});
}
