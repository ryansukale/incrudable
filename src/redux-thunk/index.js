import processResources from '../processResources';
// import fromResource from './fromResource';

// export default function incrudable(resources, config) {
//   return processResources(resources, fromResource, config);
// }

import generateThunk from './generateThunk';
// import getActionGroups from '../getActionGroups';

export default function incrudable(resources, config) {
  return processResources(generateThunk, resources, config);
}

// export function processResources(taskGenerator, resources, config) {
//   return Object.keys(resources).reduce((acc, key) => {
//     const resource = resources[key];
//     acc[resource.name] = fromResource(taskGenerator, resource, config);
//     return acc;
//   }, {});
// }

// export function fromResource(taskGenerator, resource, config) {
//   const { operations } = resource;
//   const actionGroups = getActionGroups(resource, operations);

//   return getTasks(taskGenerator, resource, actionGroups, config);
// }

// export function getTasks(taskGenerator, resource, actionGroups, config) {
//   return Object.keys(actionGroups).reduce((acc, operation) => {
//     const url = resource.operations[operation];
//     const actions = actionGroups[operation];

//     const task = taskGenerator(
//       {
//         operation,
//         actions,
//         url
//       },
//       config
//     );

//     Object.keys(actions).reduce((target, actionName) => {
//       target[actionName] = actions[actionName];
//       return target;
//     }, task);

//     acc[operation] = task;

//     return acc;
//   }, {});
// }
