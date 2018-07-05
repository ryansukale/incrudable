import { createAction } from 'redux-actions';

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
          `The value of the custom operation name ${operation} for ${
            resource.name
          } must be an object`
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

      const { actionTypes } = operationConfig;
      const customActions = actionTypes
        ? {
            wait: createAction(actionTypes.wait),
            success: createAction(actionTypes.success),
            failure: createAction(actionTypes.failure)
          }
        : operationConfig.actions;

      if (
        (actionTypes && !actionTypes.wait) ||
        !actionTypes.success ||
        !actionTypes.failure
      ) {
        throw new Error(
          `actionTypes of ${operation} for ${
            resource.name
          } must include all of 'wait', 'success' and 'failure'`
        );
      }

      resourceConfig = {
        method,
        actions: customActions || defaultActions,
        ...operationConfig // Override the defaults with whatever the user provides
      };
    }

    if (!resourceConfig.url) {
      throw new Error(
        `missing 'url' for ${resource.name}.operations.${operation}`
      );
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
