const defaultAjax = {
  postJSON() {
    // TODO based on fetch
  }
}

function create({url, actions}, {ajax}) {
  return function createThunk(params, done) {
    return (dispatch) => {
      actions.wait && dispatch(actions.wait());

      return ajax
        .postJSON(url, params)
        .then((data) => {
          actions.success && dispatch(actions.success(data));
        })
        .catch((errors) => {
          actions.fail && dispatch(actions.fail(data));
        });
    }
  }
}

function read() {

}

function update() {

}

function del() {

}

function list() {

}

export const thunkGenerators = {
  create,
  read,
  update,
  del,
  list
};

export default function generateThunk({
  operation,
  actions,
  url
}, config = {}) {
  const operationName = operation.toLowerCase();
  const generator = thunkGenerators[operationName];
  if (!generator) {
    throw new Error(`operation should be one of ${Object.keys(thunkGenerators)}. Received: ${type}`);
  }

  config.ajax = config.ajax || defaultAjax;

  return generator({url, actions}, config);
}
