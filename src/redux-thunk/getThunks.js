// import createActionGroup from './createActionGroup';

export default function getThunks(resource, actions) {
  return Object.keys(actions).reduce((acc, operation) => {
    acc[operation] = 'TODO';
    return acc;
  }, {});
  // return operations.reduce((acc, operation) => {
  //   acc[operation] = createActionGroup(eventBase, undefined, operation);
  //   return acc;
  // }, {});
}
