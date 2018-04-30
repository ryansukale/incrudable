import processResources from '../lib/processResources';
import fromResource from './lib/fromResource';

export fromResource;

export default function incrudable(resources) {
  return processResources(resources, fromResource);
}
