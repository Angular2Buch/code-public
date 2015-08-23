import { ElementSchemaRegistry } from './element_schema_registry';
export declare class DomElementSchemaRegistry extends ElementSchemaRegistry {
    hasProperty(elm: any, propName: string): boolean;
    getMappedPropName(propName: string): string;
}
