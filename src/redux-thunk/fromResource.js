import getActions from '../getActions';
import getTasks from './getTasks';

export default function fromResource(resource, config) {
  const { name, operations } = resource;
  const actionGroups = getActions(resource, operations);

  return getTasks(resource, actionGroups, config);
}
