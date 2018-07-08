import { combineEpics } from 'redux-observable';

import fromResource from '../fromResource';
import generateEpic from './generateEpic';

export default function(...args) {
  const tasks = fromResource.apply(null, [generateEpic, ...args]);
  
  const epics = Object.keys(tasks).map(taskName => tasks[taskName].epic);

  tasks.epic = combineEpics(...epics);
  
  return tasks;
}
