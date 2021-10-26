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


import * as runtime from '../runtime';
import {
    Registration,
    RegistrationFromJSON,
    RegistrationToJSON,
    RegistrationCreate,
    RegistrationCreateFromJSON,
    RegistrationCreateToJSON,
    UserVerified,
    UserVerifiedFromJSON,
    UserVerifiedToJSON,
} from '../models';

export interface RegistrationCreateRequest {
    registrationCreate: RegistrationCreate;
}

export interface RegistrationVerifyCreateRequest {
    code: string;
}

/**
 * 
 */
export class RegistrationApi extends runtime.BaseAPI {

    /**
     * Create a new registeration and sends out an activation email.
     */
    async registrationCreateRaw(requestParameters: RegistrationCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<Registration>> {
        if (requestParameters.registrationCreate === null || requestParameters.registrationCreate === undefined) {
            throw new runtime.RequiredError('registrationCreate','Required parameter requestParameters.registrationCreate was null or undefined when calling registrationCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/registration/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegistrationCreateToJSON(requestParameters.registrationCreate),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RegistrationFromJSON(jsonValue));
    }

    /**
     * Create a new registeration and sends out an activation email.
     */
    async registrationCreate(requestParameters: RegistrationCreateRequest, initOverrides?: RequestInit): Promise<Registration> {
        const response = await this.registrationCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Verifiy registration email, create user and return login token
     */
    async registrationVerifyCreateRaw(requestParameters: RegistrationVerifyCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<UserVerified>> {
        if (requestParameters.code === null || requestParameters.code === undefined) {
            throw new runtime.RequiredError('code','Required parameter requestParameters.code was null or undefined when calling registrationVerifyCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/registration/verify/{code}/`.replace(`{${"code"}}`, encodeURIComponent(String(requestParameters.code))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserVerifiedFromJSON(jsonValue));
    }

    /**
     * Verifiy registration email, create user and return login token
     */
    async registrationVerifyCreate(requestParameters: RegistrationVerifyCreateRequest, initOverrides?: RequestInit): Promise<UserVerified> {
        const response = await this.registrationVerifyCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

}