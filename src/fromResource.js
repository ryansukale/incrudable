import getActionGroups from './getActionGroups';
import getTasks from './getTasks';

export default function fromResource(taskGenerator, resource, config) {
  const { operations } = resource;
  const actionGroups = getActionGroups(resource.name, operations);

  return getTasks(taskGenerator, resource, actionGroups, config);
}
