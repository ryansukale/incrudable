import { expect } from 'chai';

import createActionType from '../src/createActionType';

describe('createActionType', () => {
  it('returns a string in the action type format', () => {
    const options = {
      prefix: 'create',
      suffix: 'success'
    };
    expect(createActionType('albums', options)).to.equal(
      'CREATE_ALBUMS_SUCCESS'
    );
  });

  it('returns a string if suffix isint passed', () => {
    const options = {
      prefix: 'create'
    };
    expect(createActionType('albums', options)).to.equal('CREATE_ALBUMS');
  });

  it('returns a string if prefix isint passed', () => {
    const options = {
      suffix: 'success'
    };
    expect(createActionType('albums', options)).to.equal('ALBUMS_SUCCESS');
  });

  it('returns a string when options are not prvided', () => {
    expect(createActionType('albums')).to.equal('ALBUMS');
  });
});
