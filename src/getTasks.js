export default function getTasks(taskGenerator, resource, actionGroups, deps) {
  return Object.keys(actionGroups).reduce((acc, operation) => {
    let resourceConfig = {
      actions: actionGroups[operation]
    };

    const operationConfig = resource.operations[operation];
    if (typeof operationConfig === 'string') {
      resourceConfig.url = operationConfig;
    } else {
      resourceConfig = { ...resourceConfig, ...operationConfig };
    }

    const task = taskGenerator(
      {
        operation,
        ...resourceConfig
      },
      deps
    );

    Object.keys(resourceConfig.actions).reduce((target, actionName) => {
      target[actionName] = resourceConfig.actions[actionName];
      return target;
    }, task);

    acc[operation] = task;

    return acc;
  }, {});
}
