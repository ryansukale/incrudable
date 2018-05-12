function create() {

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

export default function getThunks(type, ...args) {
  const methodName = type.toLowerCase();
  const generator = thunkGenerators[methodName];
  if (!generator) {
    throw new Error(`type should be one of ${Object.keys(thunkGenerators)}. Received: ${type}`);
  }

  return generator.apply(null, args);
}
