import getActions from './getActions';
const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

function crudGenerator(resource) {
  const {name, singular, basePath, operations = DEFAULT_OPERATIONS} = resource;
  
  return {
    actions: getActions(resource, operations),
    thunks: 'TODO'
  };
}

export default function incrudable(resources) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[resource.name] = crudGenerator(resource);
    return acc;
  }, {});
}
