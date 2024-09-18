import yaml from 'js-yaml';
import fs from 'fs';

// Input YAML
const yamlInput = fs.readFileSync('./spec.yaml').toString();
const conway = JSON.parse(fs.readFileSync('./CIPs/CIP-0116/cardano-conway.json').toString());
const babbage = JSON.parse(fs.readFileSync('./CIPs/CIP-0116/cardano-babbage.json').toString());

// Parse YAML to JSON
const parsedYaml = yaml.load(yamlInput);

function isEqual(value1, value2) {
  if (value1 === value2) {
    return true;
  }

  if (typeof value1 !== 'object' || value1 === null || typeof value2 !== 'object' || value2 === null) {
    return false;
  }

  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !isEqual(value1[key], value2[key])) {
      return false;
    }
  }

  return true;
}

function deepEqualUpToRefSchema(value1, value2) {
  if (value1 === value2) {
    return true;
  }

  if (typeof value1 !== 'object' || value1 === null || typeof value2 !== 'object' || value2 === null) {
    return false;
  }

  const keys1 = Object.keys(value1);
  const keys2 = Object.keys(value2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (key == '$ref') {
      return value1[key].split('#')[1] ==
        value2[key].split('#')[1];
    }

    if (!keys2.includes(key) || !deepEqualUpToRefSchema(value1[key], value2[key])) {
      return false;
    }
  }

  return true;
}

class DeepSet {
  constructor(comparator) {
    this.items = []; // To store objects
    this.comparator = comparator;
  }

  add(item) {
    if (!this.has(item)) {
      this.items.push(item);
    }
  }

  has(item) {
    return this.items.some(existingItem => this.comparator(existingItem, item));
  }

  delete(item) {
    const index = this.items.findIndex(existingItem => this.comparator(existingItem, item));
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  get size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

function resolveRefs(schema, definitions) {
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

function getNestedProperty(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== 'undefined') ? acc[key] : undefined, obj);
}

function inlineRefs(schema) {

  if (!schema.definitions) {
    throw new Error('No definitions found in the schema');
  }

  const inlinedSchema = resolveRefs(schema, schema.definitions);

  return inlinedSchema;
}

const mkDigest = (schema, requestType) =>
      resolveRefs(schema, schema.definitions).definitions[requestType];

// Function to convert parsed YAML to OpenAPI format
const convertToRPCSchema = (endpoints) => {
  const paths = {};
  const schemas = [
    [ "cardano-conway.json#/definitions/", conway ],
    [ "cardano-babbage.json#/definitions/", babbage ]
  ];

  Object.keys(endpoints).forEach(endpoint => {
    Object.keys(endpoints[endpoint]).forEach(operation => {
      const requestBody = endpoints[endpoint][operation].request;

      const buildObjectSchema = (requestBody) => {
        const schemaObj = {
          title: endpoint + ' by ' + operation,
          type: 'object',
          properties: {}
        };

        const makeAnyOfAlternatives = (schemas, requestType) => {
          const alternatives = [];
          const altSet = new DeepSet(deepEqualUpToRefSchema);

          schemas.forEach(([ref, schema]) => {
            const digest = mkDigest(schema, requestType);

            if (altSet.has(digest)) return;
            altSet.add(digest);
            // console.log(digest);
            alternatives.push({
              "$ref": ref + requestType
            });
          });

          return alternatives;
        };

        if (typeof requestBody == 'string') {

          const alternatives = makeAnyOfAlternatives(schemas, requestBody);

          schemaObj.properties = undefined;
          schemaObj.anyOf = alternatives;

          return schemaObj;

        } else for (const [requestProperty, requestType] of Object.entries(requestBody)) {
          if (typeof requestType == 'string') {

            const alternatives = makeAnyOfAlternatives(schemas, requestType);

            schemaObj.properties[requestProperty] = {
              anyOf: alternatives
            };

            return schemaObj;
          } else if (requestType.type == 'array') {
            schemaObj.properties[requestProperty] = {
              type: 'array',
              items: {
                anyOf: makeAnyOfAlternatives(schemas, requestType.items)
              }
            };
            return schemaObj;
          } else {
            console.warn('unknown requestType', requestBody);
          }
        }
      };

      if (requestBody) {
        const requestSchema = buildObjectSchema(requestBody);
        paths[endpoint + '/' + operation + ':request'] = requestSchema;
      }
      const responseBody = endpoints[endpoint][operation].response;
      const responseSchema = buildObjectSchema(responseBody);
      paths[endpoint + '/' + operation + ':response'] = responseSchema;

      // paths[endpoint + '_response'] = responseBody;
    });
  });

  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "cardano-query-layer.json",
    "title": "Cardano Query Layer types",
    "definitions": paths
  };

  return schema;
};

// Function to convert parsed YAML to OpenAPI format
const convertToOpenAPI = (endpoints) => {
  const paths = {};

  Object.keys(endpoints).forEach(endpoint => {
    Object.keys(endpoints[endpoint]).forEach(operation => {
      const requestBody = endpoints[endpoint][operation].request;
      const responseBody = endpoints[endpoint][operation].response;

      paths[`/${endpoint}/${operation}`] = {
        post: {
          summary: `${operation} operation on ${endpoint}`,
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: requestBody,
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: responseBody,
                },
              },
            },
          },
        },
      };
    });
  });

  return {
    openapi: '3.0.0',
    info: {
      title: 'Auto-Generated API',
      version: '1.0.0',
    },
    paths,
  };
};

// Convert to OpenAPI JSON
const openApiSpec = convertToOpenAPI(parsedYaml.endpoints);
const jsonSpec = convertToRPCSchema(parsedYaml.endpoints);
console.log(JSON.stringify(jsonSpec, null, 2));
// // Output the result as a JSON file
// const outputPath = './openapi.json';

// fs.writeFileSync(outputPath, JSON.stringify(openApiSpec, null, 2));

// console.log(`OpenAPI specification generated at ${outputPath}`);
