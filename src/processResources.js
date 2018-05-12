export default function processResources(resources, crudGenerator) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[resource.name] = crudGenerator(resource);
    return acc;
  }, {});
}
