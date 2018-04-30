export default function createActionType(base, options = {}) {
  const prefix = options.prefix ? `${prefix}_` : '';
  const suffix = options.suffix ? `_${suffix}` : '';
  return `${prefix}${base}${suffix}`.toUpperCase();
}