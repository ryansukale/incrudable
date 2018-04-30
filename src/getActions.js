import createActionGroup from './createActionGroup';

export default function getActions(eventBase, operations) {
  return operations.reduce((acc, operation) => {
    acc[operation] = createActionGroup(eventBase, undefined, operation);
    return acc;
  }, {});
}