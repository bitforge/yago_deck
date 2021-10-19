/* tslint:disable */
/* eslint-disable */
/**
 * Genie API
 * Augement Reality for E-commerce made simple.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: hello@genie-ar.ch
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface HealthStatus
 */
export interface HealthStatus {
    /**
     * 
     * @type {boolean}
     * @memberof HealthStatus
     */
    dbUp: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof HealthStatus
     */
    storageUp: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof HealthStatus
     */
    cacheUp: boolean;
}

export function HealthStatusFromJSON(json: any): HealthStatus {
    return HealthStatusFromJSONTyped(json, false);
}

export function HealthStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): HealthStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'dbUp': json['db_up'],
        'storageUp': json['storage_up'],
        'cacheUp': json['cache_up'],
    };
}

export function HealthStatusToJSON(value?: HealthStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'db_up': value.dbUp,
        'storage_up': value.storageUp,
        'cache_up': value.cacheUp,
    };
}


