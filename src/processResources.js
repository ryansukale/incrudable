export default function processResources(crudGenerator) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[resource.name] = crudGenerator(resource);
    return acc;
  }, {});
}
