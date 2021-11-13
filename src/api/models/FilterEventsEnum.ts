/* tslint:disable */
/* eslint-disable */
/**
 * Genie API
 * Augemented Reality Made Easy.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: hello@genie-ar.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * 
 * @export
 * @enum {string}
 */
export enum FilterEventsEnum {
    All = 'all',
    Ar = 'ar',
    Model = 'model'
}

export function FilterEventsEnumFromJSON(json: any): FilterEventsEnum {
    return FilterEventsEnumFromJSONTyped(json, false);
}

export function FilterEventsEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): FilterEventsEnum {
    return json as FilterEventsEnum;
}

export function FilterEventsEnumToJSON(value?: FilterEventsEnum | null): any {
    return value as any;
}

