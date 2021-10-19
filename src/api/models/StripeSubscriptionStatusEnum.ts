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

/**
 * 
 * @export
 * @enum {string}
 */
export enum StripeSubscriptionStatusEnum {
    Active = 'active',
    Canceled = 'canceled',
    Incomplete = 'incomplete',
    IncompleteExpired = 'incomplete_expired',
    PastDue = 'past_due',
    Trialing = 'trialing',
    Unpaid = 'unpaid'
}

export function StripeSubscriptionStatusEnumFromJSON(json: any): StripeSubscriptionStatusEnum {
    return StripeSubscriptionStatusEnumFromJSONTyped(json, false);
}

export function StripeSubscriptionStatusEnumFromJSONTyped(json: any, ignoreDiscriminator: boolean): StripeSubscriptionStatusEnum {
    return json as StripeSubscriptionStatusEnum;
}

export function StripeSubscriptionStatusEnumToJSON(value?: StripeSubscriptionStatusEnum | null): any {
    return value as any;
}

