import fromResource from './fromResource';

export default function processResources(taskGenerator, resources, config) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[resource.name] = fromResource(taskGenerator, resource, config);
    return acc;
  }, {});
}
