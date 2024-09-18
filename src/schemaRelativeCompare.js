// A comparison function that ignores schema names in $refs: for example,
//
// { '$ref': 'cardano-conway.json#/definitions/Foo' }
// and
// { '$ref': 'cardano-babbage.json#/definitions/Foo' }
// are considered equal.
// We specifically don't care about era distinction, because we expand all the refs recursively
// and compare the schemas structurally anyway.
// So, if there is at least one difference, EXCEPT the era name, the function will return false
export function schemaRelativeCompare(value1, value2) {
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

    if (!keys2.includes(key) || !schemaRelativeCompare(value1[key], value2[key])) {
      return false;
    }
  }

  return true;
}
