const operationMethods = {
  create: 'post',
  read: 'get',
  update: 'put',
  del: 'delete',
  list: 'get'
};

const supportedMethods = {
  get: true,
  post: true,
  put: true,
  delete: true
};

export default function getTasks(taskGenerator, resource, actionGroups, deps) {
  return Object.keys(resource.operations).reduce((acc, operation) => {
    const operationConfig = resource.operations[operation];
    const defaultActions = actionGroups[operation];
    const configIsAString = typeof operationConfig === 'string';
    const method = operationMethods[operation.toLowerCase()];
    let resourceConfig;

    if (configIsAString) {
      // String shorthand is allowed only for well known operation names
      if (!method) {
        throw new Error(
          `The value of the custom operation name ${operation} must be an object`
        );
      }

      resourceConfig = {
        method,
        url: operationConfig,
        actions: defaultActions
      };
    } else {
      if (
        operationConfig.method &&
        !supportedMethods[operationConfig.method.toLowerCase()]
      ) {
        throw new Error(
          `Unsupported method ${operationConfig.method} specified for ${
            resource.name
          }.operations.${operation}`
        );
      }
      resourceConfig = {
        method,
        actions: defaultActions,
        ...operationConfig // Override the defaults with whatever the user provides
      };
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
