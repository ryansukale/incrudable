import createActionGroup from './createActionGroup';
const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

export function getActions(eventBase, operations) {
  return operations.reduce((acc, operation) => {
    acc[operation] = createActionGroup(eventBase, undefined, operation);
    return acc;
  }, {});
}

/**
 * @param  {hash} resource 
 *  {
 *    name: 'albums',
 *    singular: 'album',
 *    basePath: '/data/albums',
 *    operations: ['create', 'read']
 *  }
 * @return {hash} {actions, thunks}
 */
export default function fromResource(resource) {
  const {name, singular, basePath, operations = DEFAULT_OPERATIONS} = resource;
  const actions = getActions(name, operations);
  return {actions};
}