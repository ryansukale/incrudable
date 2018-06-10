import getActionGroups from './getActionGroups';
import getTasks from './getTasks';

export default function fromResource(taskGenerator, resource, config) {
  const { operations } = resource;
  const actionGroups = getActionGroups(resource, operations);

  return getTasks(taskGenerator, resource, actionGroups, config);
}
