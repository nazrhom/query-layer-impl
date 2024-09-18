import yaml from 'js-yaml';
import fs from 'fs';

import { expandSchemaRefs } from './src/schemaRefs.js';
import { DeepSet } from './src/deepSet.js';
import { schemaRelativeCompare } from './src/schemaRelativeCompare.js';

// Input YAML
const yamlInput = fs.readFileSync('./spec.yaml').toString();

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
const convertToRPCSchema = (endpoints) => {
  const paths = {};

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
