/**
 * Possible data types
 */
export type Jtd_Type =
  | 'boolean'
  | 'string'
  | 'timestamp'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'float32'
  | 'float64';

/**
 * Basic JTD Schema
 */
export type Jtd_Schema = {
  type?: Jtd_Type;
  properties?: { [key: string]: Jtd_Schema };
  optionalProperties?: { [key: string]: Jtd_Schema };
  additionalProperties?: boolean;
  elements?: Jtd_Schema;
  values?: Jtd_Schema;
  enum?: any[];
  nullable?: boolean;
};

export default function generateJtd(json: any): Jtd_Schema {
  function parseObject(obj: any): Jtd_Schema {
    const schema: Jtd_Schema = {
      properties: {},
    };
    Object.keys(obj).forEach(key => {
      if (schema.properties) {
        schema.properties[key] = parseItem(obj[key]);
      }
    });
    return schema;
  }

  function parseArray(arr: any[]): Jtd_Schema {
    const schema: Jtd_Schema = {};
    if (arr.length > 0) {
      schema.elements = parseItem(arr[0]);
    }
    return schema;
  }

  function parseItem(item: any): Jtd_Schema {
    const myType = typeof item;
    // Handle null
    if (item === null || item === undefined) {
      return {
        nullable: true,
      };
    }
    // If it's an array then we define the sub-schema for its items
    if (Array.isArray(item)) {
      return parseArray(item);
    }
    // If this is an object, then it has its own schema inside
    if (myType === 'object') {
      return parseObject(item);
    }
    // other type
    const jtdType: Jtd_Type = (() => {
      // Any number to float64 since we don't know better
      if (myType === 'number') {
        return 'float64';
      }
      if (myType === 'boolean') {
        return 'boolean';
      }
      // Could potentially look for a timestamp here, but for now just string
      return 'string';
    })();
    return {
      type: jtdType,
    };
  }

  return parseItem(json);
}
