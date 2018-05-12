import {expect} from 'chai';

import incrudable from '../src';

const resources = {
  albums: {
    name: 'albums',
    singular: 'album',
    basePath: '/data/albums'
  },
  songs: {
    name: 'songs',
    singular: 'song',
    basePath: '/data/songs'
  },
}

describe('incrudable', function () {
  it('actions and thunks for resources', function () {
    // const operations = ['create', 'read'];
    const {albums, songs} = incrudable(resources);
    console.log('albums', albums);
    console.log('songs', songs);
    // const subgroups = ['fail', 'success', 'wait'];

    // expect(Object.keys(actions)).to.have.members(operations);
    
    // expect(Object.keys(actions.create)).to.have.members(subgroups);
    // expect(Object.keys(actions.read)).to.have.members(subgroups);
  });
});
