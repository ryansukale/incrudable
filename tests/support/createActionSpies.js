import sinon from 'sinon';
import createActionGroup from '../../src/createActionGroup';

export default function createActionSpies(base) {
  const actions = createActionGroup(base);
  sinon.spy(actions, 'wait');
  sinon.spy(actions, 'success');
  sinon.spy(actions, 'failure');

  return actions;
}
