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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Registration
 */
export interface Registration {
    /**
     * 
     * @type {string}
     * @memberof Registration
     */
    readonly id: string;
    /**
     * 
     * @type {string}
     * @memberof Registration
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof Registration
     */
    firstName?: string;
    /**
     * 
     * @type {string}
     * @memberof Registration
     */
    lastName?: string;
}

export function RegistrationFromJSON(json: any): Registration {
    return RegistrationFromJSONTyped(json, false);
}

export function RegistrationFromJSONTyped(json: any, ignoreDiscriminator: boolean): Registration {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'email': json['email'],
        'firstName': !exists(json, 'first_name') ? undefined : json['first_name'],
        'lastName': !exists(json, 'last_name') ? undefined : json['last_name'],
    };
}

export function RegistrationToJSON(value?: Registration | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'first_name': value.firstName,
        'last_name': value.lastName,
    };
}


