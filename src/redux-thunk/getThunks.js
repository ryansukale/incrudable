// import createActionGroup from './createActionGroup';

function getTaskName(resource, operation) {
  // TODO transform to camel case names like 
  // createAlbum, readAlbum, listAlbums etc
  return operation;
}

export default function getThunks(resource, actions) {
  return Object.keys(actions).reduce((acc, operation) => {
    const taskName = getTaskName(resource, operation);
    acc[taskName] = 'TODO';
    return acc;
  }, {});
  // return operations.reduce((acc, operation) => {
  //   acc[operation] = createActionGroup(eventBase, undefined, operation);
  //   return acc;
  // }, {});
}
