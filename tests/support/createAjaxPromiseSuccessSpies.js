import sinon from 'sinon';

export default function createAjaxPromiseSuccessSpies() {
  return {
    postJSON: sinon.spy(() => Promise.resolve('postJSON')),
    getJSON: sinon.spy(() => Promise.resolve('getJSON')),
    putJSON: sinon.spy(() => Promise.resolve('putJSON')),
    delJSON: sinon.spy(() => Promise.resolve('delJSON'))
  };
}
