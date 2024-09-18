// used to resolve schema paths
function getNestedProperty(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== 'undefined') ? acc[key] : undefined, obj);
}

// Replaces all `$ref`s in a schema with their contents. Recursive types are supported:
// the refs will not be resolved more than one level deep
export function inlineRefs(schema) {

  if (!schema.definitions) {
    throw new Error('No definitions found in the schema');
  }

  const inlinedSchema = resolveRefs(schema, schema.definitions);

  return inlinedSchema;
}

// implementation of inlineRefs
export function resolveRefs(schema, definitions) {
  // maintain a stack to handle cyclic refs
  const stack = [];

  function resolveRefsImpl (schema, definitions) {
    if (typeof schema === 'object' && schema !== null) {
      if ('$ref' in schema) {
        // "cardano-babbage.json#/definitions/RewardAddress"
        const refPath = schema['$ref'].split('/');
        const refKey = refPath[2];

        if (stack.includes(refKey)) {
          stack.push(refKey);
          const res = getNestedProperty(definitions, refKey);
          stack.pop();
          return res;
        } else  {
          stack.push(refKey);
          const res = resolveRefsImpl(getNestedProperty(definitions, refKey), definitions);
          stack.pop();
          return res;
        }
      }

      const resolvedSchema = Array.isArray(schema) ? [] : {};

      for (const key in schema) {
        resolvedSchema[key] = resolveRefsImpl(schema[key], definitions);
      }

      return resolvedSchema;
    }

    return schema;
  }

  return resolveRefsImpl(schema, definitions);
}

// Expand refs for a single type in a schema
export const expandSchemaRefs = (schema, requestType) =>
  resolveRefs(schema, schema.definitions).definitions[requestType];
