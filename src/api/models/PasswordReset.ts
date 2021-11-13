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
 * Serializer for requesting a password reset e-mail.
 * @export
 * @interface PasswordReset
 */
export interface PasswordReset {
    /**
     * 
     * @type {string}
     * @memberof PasswordReset
     */
    email: string;
}

export function PasswordResetFromJSON(json: any): PasswordReset {
    return PasswordResetFromJSONTyped(json, false);
}

export function PasswordResetFromJSONTyped(json: any, ignoreDiscriminator: boolean): PasswordReset {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
    };
}

export function PasswordResetToJSON(value?: PasswordReset | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
    };
}


