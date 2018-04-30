export default function processResources(crudGenerator) {
  return Object.keys(resources).reduce((acc, key) => {
    const resource = resources[key];
    acc[key] = crudGenerator(resources[key]);
    return acc;
  }, {});
}