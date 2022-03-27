import AjvJsonSchema, { ErrorObject, Schema, ValidateFunction } from 'ajv';
import AjvJtd from 'ajv/dist/jtd';
import generateJtd from '@flagpolejs/json-to-jtd';
import generateJsonSchema from '@flagpolejs/json-to-jsonschema';
import { JsonData } from '../types/general.types';
import {
  ensureDirSync,
  ensureFileSync,
  existsSync,
  readFileSync,
  writeFileSync,
} from 'fs-extra';
import { env } from 'process';
import { resolve } from 'path';

export type SchemaType = 'JsonSchema' | 'JTD';

export type AjvErrors =
  | ErrorObject<string, Record<string, any>, unknown>[]
  | null
  | undefined;

const loadSchemaValidator = (
  schemaType: SchemaType,
  schema: Schema,
): ValidateFunction => {
  // AJV JsonSchema
  if (schemaType === 'JsonSchema') {
    const ajv = new AjvJsonSchema();
    return ajv.compile(schema);
  }
  // JTD
  const ajv = new AjvJtd();
  return ajv.compile(schema);
};

const validateSchema = (
  thisValue: JsonData,
  schema: Schema,
  schemaType: SchemaType,
): string[] => {
  const validator = loadSchemaValidator(schemaType, schema);
  const isValid: boolean = validator(thisValue);
  const errors: AjvErrors = validator.errors;
  const errorMessages: string[] = [];
  if (!isValid && !!errors) {
    errors.forEach(err => {
      errorMessages.push(`${err.instancePath} ${err.message}`);
    });
  }
  return errorMessages;
};

function writeSchema(
  json: JsonData,
  schemaName: string,
  schemaType: SchemaType,
): Schema {
  const schema =
    schemaType == 'JsonSchema' ? generateJsonSchema(json) : generateJtd(json);
  writeFileSync(getSchemaPath(schemaName), JSON.stringify(schema, null, 2));
  return schema;
}

const getSchemaPath = (schemaName: string): string => {
  let path: string;
  if (schemaName.startsWith('@') && schemaName.length > 1) {
    // Schemas folder
    const schemasFolder = env.FLAGPOLE_SCHEMAS_FOLDER || process.cwd();
    ensureDirSync(schemasFolder);
    path = resolve(schemasFolder, `${schemaName.substring(1)}.json`);
  } else {
    path = resolve(schemaName);
  }
  ensureFileSync(path);
  return path;
};

export const getSchema = (schemaName: string): Schema | null => {
  const schemaPath = getSchemaPath(schemaName);
  if (existsSync(schemaPath)) {
    const content = readFileSync(schemaPath, 'utf8');
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }
  return null;
};

const testSchema = async (
  json: JsonData,
  schemaName: string,
  schemaType: SchemaType,
): Promise<string[]> => {
  const schema =
    getSchema(schemaName) || writeSchema(json, schemaName, schemaType);
  return validateSchema(json, schema, schemaType);
};

export default testSchema;
