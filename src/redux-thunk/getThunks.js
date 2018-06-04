import generateThunk from './generateThunk';

// function getTaskName(resource, operation) {
//   // TODO transform to camel case names like 
//   // createAlbum, readAlbum, listAlbums etc
//   return operation;
// }

export default function getThunks(resource, actionGroups, config) {
  return Object.keys(actionGroups).reduce((acc, operation) => {
    // const taskName = getTaskName(resource, operation);
    const actions = actionGroups[operation];
    const thunk = generateThunk({
      operation,
      actions,
      url: 'TODO' // resource.basePath
    }, config);

    Object.keys(actions).reduce((target, actionName) => {
      target[actionName] = actions[actionName];
      return target;
    }, thunk);

    acc[operation] = thunk;

    return acc;
  }, {});
  // return operations.reduce((acc, operation) => {
  //   acc[operation] = createActionGroup(eventBase, undefined, operation);
  //   return acc;
  // }, {});
}
