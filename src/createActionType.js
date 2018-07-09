export default function createActionType(base, options = {}) {
  const prefix = options.prefix ? `${options.prefix}_` : '';
  const suffix = options.suffix ? `_${options.suffix}` : '';
  return `${prefix}${base}${suffix}`.toUpperCase();
}
