import processResources from '../processResources';
import fromResource from '../fromResource';

export default function incrudable(resources) {
  return processResources(resources, fromResource);
}
