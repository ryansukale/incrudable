import {expect} from 'chai';
// TODO
// import chaiJsonSchema from 'chai-json-schema';
// chai.use(chaiJsonSchema);
// http://www.chaijs.com/plugins/chai-json-schema/

import incrudable from '../../src/redux-thunk';

const resources = {
  albums: {
    name: 'albums',
    singular: 'album',
    basePath: '/data/albums',
    operations: {
      create: '/albums',
      read: '/albums/:id',
      update: '/albums/:id',
      del: '/albums/:id',
      list: '/albums'
    }
  },
  songs: {
    name: 'songs',
    singular: 'song',
    basePath: '/data/songs',
    operations: {
      create: '/albums/:id/songs',
      read: '/albums/:id/songs/:song_id',
      update: '/albums/:id/songs/:song_id',
      del: '/albums/:id/songs/:song_id',
      list: '/albums/:id/songs'
    }
  },
}

describe('incrudable', function () {
  it('actions and thunks for resources', function () {
    // const operations = ['create', 'read'];
    const {albums, songs} = incrudable(resources);
    // console.log('albums', albums);
    // console.log('songs', songs);
    // const subgroups = ['fail', 'success', 'wait'];

    // expect(Object.keys(actions)).to.have.members(operations);
    
    // expect(Object.keys(actions.create)).to.have.members(subgroups);
    // expect(Object.keys(actions.read)).to.have.members(subgroups);
  });
});
