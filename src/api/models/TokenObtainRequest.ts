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
 * @interface TokenObtainRequest
 */
export interface TokenObtainRequest {
    /**
     * 
     * @type {string}
     * @memberof TokenObtainRequest
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof TokenObtainRequest
     */
    password: string;
}

export function TokenObtainRequestFromJSON(json: any): TokenObtainRequest {
    return TokenObtainRequestFromJSONTyped(json, false);
}

export function TokenObtainRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenObtainRequest {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'email': json['email'],
        'password': json['password'],
    };
}

export function TokenObtainRequestToJSON(value?: TokenObtainRequest | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'email': value.email,
        'password': value.password,
    };
}


