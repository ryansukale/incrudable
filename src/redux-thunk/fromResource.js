import getActions from '../getActions';
const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

export default function fromResource(resource) {
  const {name, singular, basePath, operations = DEFAULT_OPERATIONS} = resource;
  
  return {
    actions: getActions(resource, operations),
    thunks: 'TODO'
  };
}
