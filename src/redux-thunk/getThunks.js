import generateThunk from './generateThunk';

// function getTaskName(resource, operation) {
//   // TODO transform to camel case names like 
//   // createAlbum, readAlbum, listAlbums etc
//   return operation;
// }

export default function getThunks(resource, actions, config) {
  return Object.keys(actions).reduce((acc, operation) => {
    // const taskName = getTaskName(resource, operation);
    acc[operation] = generateThunk({
      operation,
      actions: actions[operation],
      url: resource.basePath
    }, config);

    return acc;
  }, {});
  // return operations.reduce((acc, operation) => {
  //   acc[operation] = createActionGroup(eventBase, undefined, operation);
  //   return acc;
  // }, {});
}
