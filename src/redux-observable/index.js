import { combineEpics } from 'redux-observable';

import processResources from '../processResources';
import generateEpic from './generateEpic';
import fromResource from './fromResource';

export default function incrudable(resources, config) {
  const sources = processResources(generateEpic, resources, config);

  const epics = Object.keys(sources).reduce((acc, sourceName) => {
    const tasks = sources[sourceName];
    const epics = Object.keys(tasks).map(taskName => tasks[taskName].epic);
    tasks.epic = combineEpics(...epics);

    return acc.concat(tasks.epic);
  }, []);
  console.log('epics', epics);

  sources.epic = combineEpics(...epics);

  return sources;
}

incrudable.fromResource = fromResource;
