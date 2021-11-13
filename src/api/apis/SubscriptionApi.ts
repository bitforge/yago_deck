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


import * as runtime from '../runtime';
import {
    NewSubscription,
    NewSubscriptionFromJSON,
    NewSubscriptionToJSON,
    Subscription,
    SubscriptionFromJSON,
    SubscriptionToJSON,
} from '../models';

export interface SubscriptionCreateRequest {
    newSubscription: NewSubscription;
}

/**
 * 
 */
export class SubscriptionApi extends runtime.BaseAPI {

    /**
     * Create a new stripe Subscription for a Genie pricing plan in state incomplete. Use client_secret to submit payment method with a stripe element to activate subscription.
     */
    async subscriptionCreateRaw(requestParameters: SubscriptionCreateRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<NewSubscription>> {
        if (requestParameters.newSubscription === null || requestParameters.newSubscription === undefined) {
            throw new runtime.RequiredError('newSubscription','Required parameter requestParameters.newSubscription was null or undefined when calling subscriptionCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        const response = await this.request({
            path: `/api/subscription/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: NewSubscriptionToJSON(requestParameters.newSubscription),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => NewSubscriptionFromJSON(jsonValue));
    }

    /**
     * Create a new stripe Subscription for a Genie pricing plan in state incomplete. Use client_secret to submit payment method with a stripe element to activate subscription.
     */
    async subscriptionCreate(requestParameters: SubscriptionCreateRequest, initOverrides?: RequestInit): Promise<NewSubscription> {
        const response = await this.subscriptionCreateRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Cancel current subscription. Subscription will be valid until current payment schedule is finished.
     */
    async subscriptionDestroyRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        const response = await this.request({
            path: `/api/subscription/`,
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Cancel current subscription. Subscription will be valid until current payment schedule is finished.
     */
    async subscriptionDestroy(initOverrides?: RequestInit): Promise<void> {
        await this.subscriptionDestroyRaw(initOverrides);
    }

    /**
     * Get details of active subscription i customer is signed up.
     */
    async subscriptionRetrieveRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<Subscription>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("jwtAuth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = this.configuration.apiKey("Authorization"); // tokenAuth authentication
        }

        const response = await this.request({
            path: `/api/subscription/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => SubscriptionFromJSON(jsonValue));
    }

    /**
     * Get details of active subscription i customer is signed up.
     */
    async subscriptionRetrieve(initOverrides?: RequestInit): Promise<Subscription> {
        const response = await this.subscriptionRetrieveRaw(initOverrides);
        return await response.value();
    }

}
