import {expect} from 'chai';

import createActionType from '../src/createActionType';

describe('createActionType', function () {
  it('returns a string in the action type format', function () {
    const options = {
      prefix: 'create',
      suffix: 'success'
    };
    expect(createActionType('albums', options)).to.equal('CREATE_ALBUMS_SUCCESS');
  });

  it('returns a string if suffix isint passed', function () {
    const options = {
      prefix: 'create'
    };
    expect(createActionType('albums', options)).to.equal('CREATE_ALBUMS');
  });

  it('returns a string if prefix isint passed', function () {
    const options = {
      suffix: 'success'
    };
    expect(createActionType('albums', options)).to.equal('ALBUMS_SUCCESS');
  });

  it('returns a string when options are not prvided', function () {
    expect(createActionType('albums')).to.equal('ALBUMS');
  });
});
