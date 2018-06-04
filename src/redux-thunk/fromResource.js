import getActions from '../getActions';
import getThunks from './getThunks';
// const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

export default function fromResource(resource, config) {
  const {name, operations} = resource;
  const actionGroups = getActions(resource, operations);

  return getThunks(resource, actionGroups, config);
}
