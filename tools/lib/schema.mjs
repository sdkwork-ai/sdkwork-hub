/**
 * Minimal JSON Schema (2020-12 subset) validator.
 *
 * The hub must verify generated artifacts without runtime dependencies. This
 * validator supports the keywords the hub schemas actually use: $ref (local),
 * type, const, enum, pattern, minimum, required, properties,
 * additionalProperties, items, and uniqueItems.
 */

export function validate(rootSchema, value) {
  const violations = [];

  const resolveRef = (ref) => {
    if (typeof ref !== 'string' || !ref.startsWith('#/')) {
      throw new Error(`unsupported $ref: ${String(ref)}`);
    }
    let node = rootSchema;
    for (const part of ref.slice(2).split('/')) {
      if (node === undefined || node === null) throw new Error(`unresolved $ref: ${ref}`);
      node = node[part];
    }
    if (node === undefined) throw new Error(`unresolved $ref: ${ref}`);
    return node;
  };

  const typeOf = (input) => {
    if (input === null) return 'null';
    if (Array.isArray(input)) return 'array';
    if (typeof input === 'number') return Number.isInteger(input) ? 'integer' : 'number';
    return typeof input;
  };

  const matchesType = (type, actual) => {
    if (type === actual) return true;
    if (type === 'number' && actual === 'integer') return true;
    return false;
  };

  const walk = (schema, input, pointer) => {
    if (!schema || typeof schema !== 'object') return;
    if (schema.$ref) {
      walk(resolveRef(schema.$ref), input, pointer);
      return;
    }

    if (schema.type) {
      const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
      const actual = typeOf(input);
      if (!allowed.some((type) => matchesType(type, actual))) {
        violations.push({ path: pointer, message: `expected ${allowed.join('|')}, got ${actual}` });
        return;
      }
    }

    if ('const' in schema && JSON.stringify(input) !== JSON.stringify(schema.const)) {
      violations.push({ path: pointer, message: `expected constant ${JSON.stringify(schema.const)}` });
    }

    if (Array.isArray(schema.enum) && !schema.enum.some((item) => JSON.stringify(item) === JSON.stringify(input))) {
      violations.push({ path: pointer, message: `expected one of ${schema.enum.map((item) => JSON.stringify(item)).join(', ')}` });
    }

    if (typeof input === 'string' && typeof schema.pattern === 'string') {
      if (!new RegExp(schema.pattern, 'u').test(input)) {
        violations.push({ path: pointer, message: `value does not match pattern ${schema.pattern}` });
      }
    }

    if (typeof input === 'number' && typeof schema.minimum === 'number' && input < schema.minimum) {
      violations.push({ path: pointer, message: `value ${input} is below minimum ${schema.minimum}` });
    }

    if (Array.isArray(input)) {
      if (schema.items && typeof schema.items === 'object') {
        input.forEach((item, index) => walk(schema.items, item, `${pointer}[${index}]`));
      }
      if (schema.uniqueItems === true) {
        const seen = new Set();
        for (const item of input) {
          const key = JSON.stringify(item);
          if (seen.has(key)) violations.push({ path: pointer, message: 'array items are not unique' });
          seen.add(key);
        }
      }
      return;
    }

    if (input !== null && typeof input === 'object') {
      const properties = schema.properties && typeof schema.properties === 'object' ? schema.properties : {};
      for (const required of schema.required ?? []) {
        if (!(required in input)) {
          violations.push({ path: pointer, message: `missing required property "${required}"` });
        }
      }
      for (const [key, child] of Object.entries(input)) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
          walk(properties[key], child, `${pointer}.${key}`);
          continue;
        }
        if (schema.additionalProperties === false) {
          violations.push({ path: pointer, message: `unexpected property "${key}"` });
          continue;
        }
        if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
          walk(schema.additionalProperties, child, `${pointer}.${key}`);
        }
      }
    }
  };

  walk(rootSchema, value, '$');
  return violations;
}
