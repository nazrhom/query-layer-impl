import yaml from 'js-yaml';
import fs from 'fs';
import { Case } from 'change-case-all';

import { expandSchemaRefs } from './src/schemaRefs.js';
import { DeepSet } from './src/deepSet.js';
import { schemaRelativeCompare } from './src/schemaRelativeCompare.js';

// Input YAML
const yamlInput = fs.readFileSync('./spec.yaml').toString();

const REQUEST = Symbol('REQUEST');
const RESPONSE = Symbol('RESPONSE');

// Add new in the future
const schemas = [
  [
    "cardano-conway.json#/definitions/",
    JSON.parse(fs.readFileSync('./CIPs/CIP-0116/cardano-conway.json').toString())
  ],
  [
    "cardano-babbage.json#/definitions/",
    JSON.parse(fs.readFileSync('./CIPs/CIP-0116/cardano-babbage.json').toString())
  ]
];

// Parse YAML to JSON
const parsedYaml = yaml.load(yamlInput);

const buildTitle = (endpoint, operation, type) => {
  return endpoint + (
    operation == 'latest' ? ' (latest)' :
      operation == 'submit' ? ' submission' :
      ' by ' + operation
  ) + (
    type === REQUEST ? ' (request)' :
      type === RESPONSE ? ' (response)' :
      ''
  );
};

const makeAnyOfAlternatives = (schemas, requestType) => {
  const alternatives = [];

  const altSet = new DeepSet(schemaRelativeCompare);

  schemas.forEach(([ref, schema]) => {
    const digest = expandSchemaRefs(schema, requestType);

    if (altSet.has(digest)) return;
    altSet.add(digest);
    // console.log(digest);
    alternatives.push({
      "$ref": ref + requestType
    });
  });

  return alternatives;
};

const buildAnyOfSchema = (alternatives) => alternatives.length == 1 ? alternatives[0] : ({ anyOf: alternatives });

const buildOpenApiSchemaGetParameters = (endpoint, operation, requestBody, type) => {
  let res = [];

  if (requestBody === null) {
    // pass
  } else if (typeof requestBody == 'string') {
    // processing spec `request: Foo`
    const alternatives = makeAnyOfAlternatives(schemas, requestBody);
    res = [
      {
        name: Case.snake(requestBody),
        'in': 'query',
        required: true,
        schema: buildAnyOfSchema(alternatives)
      }
    ];
  } else if (typeof requestBody == 'object') {
    for (const [requestProperty, requestType] of Object.entries(requestBody)) {
      // processing spec
      // ```
      // request:
      //   foo: Foo
      //   bar: Bar
      // ```
      if (typeof requestType == 'string') {

        const alternatives = makeAnyOfAlternatives(schemas, requestType);

        res.push({
          name: Case.snake(requestProperty),
          'in': 'query',
          required: true,
          schema: buildAnyOfSchema(alternatives)
        });

      } else if (requestType.type == 'array') {

        // TODO: figure it out if ever needed
        throw new Error('array in a GET parameter is not supported yet');

        // const alternatives = makeAnyOfAlternatives(schemas, requestType);

        // res.push({
        //   name: Case.snake(requestType),
        //   'in': 'query',
        //   required: true,
        //   schema: {
        //     type: 'array',
        //     items: buildAnyOfSchema(alternatives)
        //   }
        // });
      } else {
        throw new Error('unknown requestType ' + requestBody);
      }
    }
  } else {
    throw new Error('Unknown request layout in spec.yaml');
  }

  return res;
};

const buildObjectSchema = (endpoint, operation, requestBody, type) => {
  let schemaObj = {
    title: buildTitle(endpoint, operation, type),
    type: 'object',
    properties: {}
  };

  if (requestBody === null) {
    return schemaObj;
  } else if (typeof requestBody == 'string') {

    const alternatives = makeAnyOfAlternatives(schemas, requestBody);

    delete schemaObj.properties;
    schemaObj = { ...schemaObj, ...buildAnyOfSchema(alternatives) };

  } else for (const [requestProperty, requestType] of Object.entries(requestBody)) {
    if (typeof requestType == 'string') {

      const alternatives = makeAnyOfAlternatives(schemas, requestType);

      schemaObj.properties[requestProperty] = buildAnyOfSchema(alternatives);

    } else if (requestType.type == 'array') {
      schemaObj.properties[requestProperty] = {
        type: 'array',
        items: buildAnyOfSchema(makeAnyOfAlternatives(schemas, requestType.items))
      };
    } else {
      throw new Error('unknown requestType ' + requestBody);
    }
  }

  return schemaObj;

};

// Function to convert parsed YAML to OpenAPI format
const convertToSchemas = (endpoints) => {
  const definitions = {};
  const paths = {};

  Object.keys(endpoints).forEach(endpoint => {
    Object.keys(endpoints[endpoint]).forEach(operation => {
      const method = endpoints[endpoint][operation].method || 'get';

      if (!['post', 'get'].includes(method)) {
        throw new Error('unknown method ' + method);
      }

      const requestBody = endpoints[endpoint][operation].request;
      const requestSchema = buildObjectSchema(endpoint, operation, requestBody, REQUEST);
      definitions[endpoint + '/' + operation + ':request'] = requestSchema;

      const responseBody = endpoints[endpoint][operation].response;
      const responseSchema = buildObjectSchema(endpoint, operation, responseBody, RESPONSE);
      definitions[endpoint + '/' + operation + ':response'] = responseSchema;

      paths[`/${endpoint}/${operation}`] = {
        [method]: {
          summary: buildTitle(endpoint, operation, REQUEST),
          responses: {
            '404': {
              description: 'Item not found'
            },
            '200': {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: responseSchema,
                },
              },
            },
          },
        },
      };

      if (method == 'get') {
        const parameters = buildOpenApiSchemaGetParameters(endpoint, operation, requestBody, REQUEST);
        paths[`/${endpoint}/${operation}`].get.parameters = parameters;
      } else if (method == 'post') {
        paths[`/${endpoint}/${operation}`].post.requestBody = {
          content: {
            'application/json': {
              schema: requestSchema,
            },
          },
        };
      }
    });
  });

  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "cardano-query-layer.json",
    "title": "Cardano Query Layer types",
    definitions
  };

  const openApiSchema = {
    openapi: '3.1.0',
    info: {
      title: 'Cardano Query Layer Specification',
      version: '1.0.0',
    },
    paths,
    components: {
      schemas: Object.fromEntries(schemas.map(([id, json]) => {
        return [
          id.split('#')[0], // `cardano-babbage.json#/definitions` -> `cardano-babbage.json`
          json
        ];
      }))
    }
  };

  return [schema, openApiSchema];
};

const [jsonSpec, openApiSpec] = convertToSchemas(parsedYaml.endpoints);

console.log(JSON.stringify(openApiSpec, null, 2));

fs.writeFileSync('./openapi.json', JSON.stringify(openApiSpec, null, 2));
fs.writeFileSync('./json-rpc.json', JSON.stringify(jsonSpec, null, 2));

console.warn(`Regenerated: openapi.json, json-rpc.json`);
