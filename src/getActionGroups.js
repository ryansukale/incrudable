import createActionGroup from './createActionGroup';

export default function getActionGroups(eventBase, operations) {
  return Object.keys(operations).reduce((acc, operation) => {
    acc[operation] = createActionGroup(eventBase, undefined, operation);
    return acc;
  }, {});
}
