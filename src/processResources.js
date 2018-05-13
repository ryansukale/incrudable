export default function processResources(resources, crudGenerator, config) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[resource.name] = crudGenerator(resource, config);
    return acc;
  }, {});
}
