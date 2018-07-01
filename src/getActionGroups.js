import createActionGroup from './createActionGroup';

export default function getActionGroups(eventBase, operations) {
  return Object.keys(operations).reduce((acc, operation) => {
    acc[operation] = createActionGroup({
      prefix: operation,
      base: eventBase
    });
    return acc;
  }, {});
}
