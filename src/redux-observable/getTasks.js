import generateEpic from './generateEpic';

export default function getTasks(resource, actionGroups, config) {
  return Object.keys(actionGroups).reduce((acc, operation) => {
    const url = resource.operations[operation];
    const actions = actionGroups[operation];

    const task = generateEpic(
      {
        operation,
        actions,
        url
      },
      config
    );

    Object.keys(actions).reduce((target, actionName) => {
      target[actionName] = actions[actionName];
      return target;
    }, task);

    acc[operation] = task;

    return acc;
  }, {});
}
