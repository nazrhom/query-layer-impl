import yaml from 'js-yaml';
import fs from 'fs';
import { Case } from 'change-case-all';
import { JSONSchemaFaker } from "json-schema-faker";

import { expandSchemaRefs } from './src/schemaRefs.js';
import { DeepSet } from './src/deepSet.js';
import { schemaRelativeCompare } from './src/schemaRelativeCompare.js';

// jsf options
JSONSchemaFaker.option({ minLength: 10, maxItems: 2, useDefaultValue: true, random: () => 0.2 });
JSONSchemaFaker.format("string64", () =>
  JSONSchemaFaker.random.randexp("[0-9a-zA-Z]{10-64}")
);
JSONSchemaFaker.format("string128", () =>
  JSONSchemaFaker.random.randexp("[0-9a-zA-Z]{10-64}")
);

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

/*
---- Helpers ----
*/
const prettyJSON = (json) => JSON.stringify(json, null, 2)

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

const buildAnyOfSchema = (alternatives) => alternatives.length == 1 ? alternatives[0] : ({ anyOf: alternatives });

const makeAnyOfAlternatives = (type) => {
  // We treat Address specially as conway simply removes one type of address from the spec
  // We only apply this optimisation when the only schemas are babbage and conway in order
  // to not introduce any mistakes in the future. This will need to be updated once
  // support for a new schema is added.
  if (type === 'Address' && schemas.length == 2) {
    return [{
      $ref: "cardano-babbage.json#/definitions/Address"
    }]
  }
  const alternatives = [];

  const altSet = new DeepSet(schemaRelativeCompare);

  schemas.forEach(([ref, schema]) => {
    const digest = expandSchemaRefs(schema, type);

    if (altSet.has(digest)) return;
    altSet.add(digest);
    alternatives.push({
      "$ref": ref + type
    });
  });

  return alternatives;
};

const schemaForType = (type) => buildAnyOfSchema(makeAnyOfAlternatives(type))

// Input is the request/response type used in spec.yaml which contains refs to the cardano-cip-0116 schemas
// We expand and resolve all refs in the input schema, and then specialize it to remove any choice (anyOf/oneOf).
const specialiseBody = (expanded) => {
  if (Array.isArray(expanded.anyOf)) {
    const pick = expanded.anyOf[0];
    delete expanded.anyOf;
    delete pick.title;
    return {...expanded, ...pick};
  }
  if (Array.isArray(expanded.oneOf)) {
    const pick = expanded.oneOf[0];
    delete expanded.oneOf;
    delete expanded.discriminator;
    delete pick.title;
    return {...expanded, ...pick};
  } else return expanded;
}

// expandSchemaRefs specialised to conway schema
const expandWithLatestSchema = (prop) => expandSchemaRefs(schemas[0][1], prop);

// Schema corresponding to null
const nullSchema = { type: null };

// resolve all refs in the input with `expandWithLatestSchema`
const expandBody = (body) => {
  if (body === null) {
    return nullSchema;
  } else if (typeof body === 'string') {
    return expandWithLatestSchema(body);
  } else if (typeof body == 'object') {
    for (const [propertyName, propertyType] of Object.entries(body)) {
      if (typeof propertyType == 'string') {
        body[propertyName] = expandBody(propertyType);

      } else if (propertyType.type == 'array') {
        propertyType.items = expandBody(propertyType.items);
      }
    }
    return body
  } else { throw new Error('Unimplemented') }
}

const buildOpenApiSchemaGetParameters = (body) => {
  let res = [];

  if (body === null) {
    // pass
  } else if (typeof body == 'string') {
    // processing spec `request: Foo`
    res = [
      {
        name: Case.snake(body),
        'in': 'query',
        required: true,
        schema: schemaForType(body)
      }
    ];
  } else if (typeof body == 'object') {
    for (const [bodyProperty, bodyType] of Object.entries(body)) {
      // processing spec
      // ```
      // request:
      //   foo: Foo
      //   bar: Bar
      // ```
      if (typeof bodyType == 'string') {
        res.push({
          name: Case.snake(bodyProperty),
          'in': 'query',
          required: true,
          schema: schemaForType(bodyType)
        });
      } else if (bodyType.type == 'array') {
        // TODO: figure it out if ever needed
        throw new Error('array in a GET parameter is not supported yet');
      } else {
        throw new Error('unknown requestType ' + body);
      }
    }
  } else {
    throw new Error('Unknown request layout in spec.yaml');
  }

  return res;
};

const buildObjectSchema = (endpoint, operation, body, type) => {
  let schemaObj = {
    title: buildTitle(endpoint, operation, type),
    type: 'object',
    properties: {}
  };

  if (body === null) {
    return schemaObj;
  } else if (typeof body == 'string') {

    delete schemaObj.properties;
    schemaObj = { ...schemaObj, ...schemaForType(body) };

  } else for (const [propertyName, propertyType] of Object.entries(body)) {
    if (typeof propertyType == 'string') {

      schemaObj.properties[propertyName] = schemaForType(propertyType);

    } else if (propertyType.type == 'array') {
      schemaObj.properties[propertyName] = {
        type: 'array',
        items: schemaForType(propertyType.items)
      };
    } else {
      throw new Error('unknown requestType ' + body);
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
        const parameters = buildOpenApiSchemaGetParameters(requestBody);
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

const titleCase = (str) => Case.title(str.split('_').join(' '))

const generateMD = (endpoints) => {
  let res = '';
  const addMDLine = (line = '') => {
    res += `\n${line}`;
  }

  const wrapCode = (code) =>  {
    addMDLine(`\`\`\`\n${code}\n\`\`\``);
  }

  const wrapCollapsibleCode = (summary, str) => {
    addMDLine('<details>');
    addMDLine(`<summary>${summary}: </summary>`);
    addMDLine();
    wrapCode(str)
    addMDLine('</details>');
  }

  for (const endpoint of Object.keys(endpoints)) {
    addMDLine(`## ${titleCase(endpoint)}`);
    addMDLine();

    for (const operation of Object.keys(endpoints[endpoint])) {
      const operationDetails = endpoints[endpoint][operation];
      const expandedRequestSchema = expandBody(operationDetails.request)
      const specialisedRequestSchema = specialiseBody(expandedRequestSchema);
      const expandedResponseSchema = expandBody(operationDetails.response)
      const specialisedResponseSchema = specialiseBody(expandedResponseSchema);

      addMDLine(`### ${titleCase(operation)}`);
      addMDLine();
      addMDLine(`${operationDetails.description}`);
      addMDLine();
      if (specialisedRequestSchema != nullSchema) {
        addMDLine(`#### Request`);
        addMDLine();
        addMDLine(`Schema:`)
        addMDLine();
        wrapCollapsibleCode('Show Schema', prettyJSON(expandedRequestSchema));
        addMDLine()
        wrapCollapsibleCode('Show Example', `${prettyJSON(JSONSchemaFaker.generate(specialisedRequestSchema, schemas))}`);
        addMDLine();
      }

      if (specialisedResponseSchema != nullSchema) {
        addMDLine(`#### Response`);
        addMDLine();
        addMDLine(`Schema:`)
        addMDLine();
        wrapCollapsibleCode('Show Schema', prettyJSON(expandedResponseSchema));
        addMDLine()
        wrapCollapsibleCode('Show Example', `${prettyJSON(JSONSchemaFaker.generate(specialisedResponseSchema, schemas))}`);
        addMDLine();
      }
    }
  }
  return res;
}

/*
---- Main ----
*/

// Input YAML
const yamlInput = fs.readFileSync('./spec.yaml').toString();

// Parse YAML to JSON
const parsedYaml = yaml.load(yamlInput);

const [jsonSpec, openApiSpec] = convertToSchemas(parsedYaml.endpoints);
const markdownSpec = generateMD(parsedYaml.endpoints);

// console.log(JSON.stringify(openApiSpec, null, 2));

fs.writeFileSync('./openapi.json', prettyJSON(openApiSpec));
fs.writeFileSync('./json-rpc.json', prettyJSON(jsonSpec));
fs.writeFileSync("./cip-spec.md", markdownSpec);

console.warn(`Regenerated: openapi.json, json-rpc.json, cip-spec.md`);
