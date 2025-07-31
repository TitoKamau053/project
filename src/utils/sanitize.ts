// Global sanitizer and safeRender utilities for React/TSX

/**
 * Recursively sanitizes API data to ensure all values are primitives or arrays/objects of primitives.
 * Converts objects/arrays to string if they are not displayable.
 */
export function sanitize<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') return data;
  if (Array.isArray(data)) {
    // If array contains only primitives, return as is, else stringify
    if (data.every(item => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')) {
      return data as any;
    }
    return JSON.stringify(data) as any;
  }
  if (typeof data === 'object') {
    // If object is a Date, convert to string
    if (data instanceof Date) return data.toISOString() as any;
    // If object has a toString that is not [object Object], use it
    if (typeof (data as any).toString === 'function' && (data as any).toString() !== '[object Object]') {
      return (data as any).toString();
    }
    // Otherwise, sanitize each property, and if any property is still an object/array, stringify it
    const sanitized: any = {};
    for (const key in data) {
      const value = (data as any)[key];
      if (value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (Array.isArray(value) || typeof value === 'object') {
        sanitized[key] = JSON.stringify(value);
      } else {
        sanitized[key] = String(value);
      }
    }
    return sanitized;
  }
  // Fallback: stringify
  return String(data) as any;
}

/**
 * Safely renders a value in JSX. Converts objects/arrays to JSON string.
 */
export function safeRender(val: unknown): string {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val) || typeof val === 'object') return JSON.stringify(val);
  return String(val);
}
