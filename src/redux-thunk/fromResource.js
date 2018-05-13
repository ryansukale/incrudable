import getActions from '../getActions';
import getThunks from './getThunks';
const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

export default function fromResource(resource, config) {
  const {name, singular, basePath, operations = DEFAULT_OPERATIONS} = resource;
  const actions = getActions(resource, operations);

  return {
    actions,
    thunks: getThunks(resource, actions, config)
  };
}
