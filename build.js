import yaml from 'js-yaml';
import fs from 'fs';

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

// Function to convert parsed YAML to OpenAPI format
const convertToSchemas = (endpoints) => {
  const definitions = {};
  const paths = {};

  Object.keys(endpoints).forEach(endpoint => {
    Object.keys(endpoints[endpoint]).forEach(operation => {
      const requestBody = endpoints[endpoint][operation].request;
      const method = endpoints[endpoint][operation].method || 'get';

      if (!['post', 'get'].includes(method)) {
        throw new Error('unknown method ' + method);
      }

      const buildObjectSchema = (requestBody, type) => {
        const schemaObj = {
          title: endpoint + (
            operation == 'latest' ? ' (latest)' :
              operation == 'submit' ? ' submission' :
              ' by ' + operation
          ) + (
            type === REQUEST ? ' (request)' :
              type === RESPONSE ? ' (response)' :
              ''
          ),
          type: 'object',
          properties: {}
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

        if (requestBody === null) {
          return schemaObj;
        } else if (typeof requestBody == 'string') {

          const alternatives = makeAnyOfAlternatives(schemas, requestBody);

          schemaObj.properties = undefined;
          schemaObj.anyOf = alternatives;

        } else for (const [requestProperty, requestType] of Object.entries(requestBody)) {
          if (typeof requestType == 'string') {

            const alternatives = makeAnyOfAlternatives(schemas, requestType);

            schemaObj.properties[requestProperty] = {
              anyOf: alternatives
            };

          } else if (requestType.type == 'array') {
            schemaObj.properties[requestProperty] = {
              type: 'array',
              items: {
                anyOf: makeAnyOfAlternatives(schemas, requestType.items)
              }
            };
          } else {
            throw new Error('unknown requestType ' + requestBody);
          }
        }

        return schemaObj;

      };

      const requestSchema = buildObjectSchema(requestBody, REQUEST);
      definitions[endpoint + '/' + operation + ':request'] = requestSchema;

      const responseBody = endpoints[endpoint][operation].response;
      const responseSchema = buildObjectSchema(responseBody, RESPONSE);
      definitions[endpoint + '/' + operation + ':response'] = responseSchema;

      paths[`/${endpoint}/${operation}`] = {
        [method]: {
          summary: ``,
          requestBody: {
            content: {
              'application/json': {
                schema: requestSchema,
              },
            },
          },
          responses: {
            '404': {
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
    });
  });

  const schema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "cardano-query-layer.json",
    "title": "Cardano Query Layer types",
    definitions
  };

  const openApiSchema = {
    openapi: '3.0.0',
    info: {
      title: 'Cardano Query Layer Specification',
      version: '1.0.0',
    },
    paths,
  };

  return [schema, openApiSchema];
};

const [jsonSpec, openApiSpec] = convertToSchemas(parsedYaml.endpoints);

console.log(JSON.stringify(openApiSpec, null, 2));

fs.writeFileSync('./openapi.json', JSON.stringify(openApiSpec, null, 2));
fs.writeFileSync('./json-rpc.json', JSON.stringify(jsonSpec, null, 2));

console.warn(`Regenerated: openapi.json, json-rpc.json`);
