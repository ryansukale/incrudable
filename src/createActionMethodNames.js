const DEFAULT_OPERATIONS = ['create', 'read', 'update', 'del', 'list'];

export function getMethodName(base, operation) {
  // TODO: capitalize first char of base
  switch (operation) {
    case 'list':
      return `read${base}List`;
    default:
      return `${operation}${base}`;
  }
}

export default function createActionMethodNames(base, operations = DEFAULT_OPERATIONS) {
  return operations.map(getMethodName.bind(base));
}
