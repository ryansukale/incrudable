import getActionGroups from '../getActionGroups';
import getTasks from './getTasks';

export default function fromResource(resource, config) {
  const { operations } = resource;
  const actionGroups = getActionGroups(resource, operations);

  return getTasks(resource, actionGroups, config);
}
