export type JsonSchema_Type =
  | 'boolean'
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'integer'
  | 'null';

export type JsonSchema = {
  type: JsonSchema_Type | JsonSchema_Type[];
  properties?: { [key: string]: JsonSchema };
  items?: JsonSchema;
  enum?: any[];
  pattern?: RegExp | string;
};

export default function generateJsonSchema(json: any): JsonSchema {
  function parseObject(obj: any): JsonSchema {
    const schema: JsonSchema = {
      type: ['object'],
      properties: {},
    };
    if (obj) {
      Object.keys(obj).forEach(key => {
        if (schema.properties) {
          schema.properties[key] = parseItem(obj[key]);
        }
      });
    }
    return schema;
  }

  function parseArray(arr: any[]): JsonSchema {
    const schema: JsonSchema = {
      type: ['array'],
    };
    if (arr.length > 0) {
      const containsAllObjects = arr.every(row => getType(row) === 'object');
      if (containsAllObjects) {
        schema.items = {
          type: ['object'],
          properties: {},
        };
        arr.forEach(row => {
          const rowSchema = parseItem(row);
          if (rowSchema.properties) {
            Object.keys(rowSchema.properties).forEach(key => {
              // Make TypeScript happy
              if (
                !schema.items ||
                !schema.items.properties ||
                !rowSchema.properties
              ) {
                return;
              }
              const prevItem = schema.items.properties[key];
              const newItem = rowSchema.properties[key];
              // If property didn't exist previously, add it
              if (!prevItem) {
                schema.items.properties[key] = newItem;
              }
              // This property already existed in schema, so merge it
              else {
                // Merge Types
                // it does not take sub-properties from the other objects after the first
                // we need to think through how this schema creation should work if it varies
                const newType = Array.isArray(newItem.type)
                  ? newItem.type
                  : [newItem.type];
                const prevType = Array.isArray(prevItem.type)
                  ? prevItem.type
                  : [prevItem.type];
                schema.items.properties[key].type = arrayUnique([
                  ...prevType,
                  ...newType,
                ]);
                // Merge Properties
                if (newItem.type == 'object' && newItem.properties) {
                  schema.items.properties[key].properties = {
                    ...newItem.properties,
                    ...schema.items.properties[key].properties,
                  };
                }
              }
            });
          }
        });
      }
      // If not all items are objects, just map the types that it may
      else {
        schema.items = {
          type: arrayUnique(
            arr.map((value: any) => getType(value)),
          ) as JsonSchema_Type[],
        };
      }
    }
    return schema;
  }

  function arrayUnique(items: any[]): any[] {
    return [...new Set(items)];
  }

  function getType(value: any): JsonSchema_Type {
    if (value === null || value === undefined) {
      return 'null';
    }
    const myType = typeof value;
    if (Array.isArray(value)) {
      return 'array';
    }
    if (myType === 'object') {
      return 'object';
    }
    if (myType == 'boolean') {
      return 'boolean';
    }
    if (myType == 'number') {
      return 'number';
    }
    return 'string';
  }

  function parseItem(item: any): JsonSchema {
    const myType = getType(item);
    if (myType === 'object') {
      return parseObject(item);
    }
    if (myType === 'array') {
      return parseArray(item);
    }
    return {
      type: [myType],
    };
  }

  return parseItem(json);
}
