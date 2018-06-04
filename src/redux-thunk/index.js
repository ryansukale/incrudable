import fromResource from './fromResource';
import processResources from '../processResources';

export default function incrudable(resources, config) {
  return processResources(resources, fromResource, config);
}
