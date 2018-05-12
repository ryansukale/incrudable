// // import processResources from '../processResources';
import fromResource from './fromResource';
import processResources from '../processResources';

// function crudGenerator(resource) {
//   return resource;
// }

// export default function incrudable(resources) {
//   return Object.keys(resources).reduce((acc, key) => {
//     const resource = resources[key];
//     acc[resource.name] = crudGenerator(resource);
//     return acc;
//   }, {});
//   // return processResources(resources, fromResource);
// }

export default function incrudable(resources) {
  return processResources(resources, fromResource);
}
