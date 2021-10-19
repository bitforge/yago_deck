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
import {
    Nested,
    NestedFromJSON,
    NestedFromJSONTyped,
    NestedToJSON,
    PaymentMethodEnum,
    PaymentMethodEnumFromJSON,
    PaymentMethodEnumFromJSONTyped,
    PaymentMethodEnumToJSON,
    StripeSubscription,
    StripeSubscriptionFromJSON,
    StripeSubscriptionFromJSONTyped,
    StripeSubscriptionToJSON,
} from './';

/**
 * 
 * @export
 * @interface Subscription
 */
export interface Subscription {
    /**
     * 
     * @type {PaymentMethodEnum}
     * @memberof Subscription
     */
    paymentMethod?: PaymentMethodEnum;
    /**
     * 
     * @type {Nested}
     * @memberof Subscription
     */
    readonly plan: Nested;
    /**
     * 
     * @type {Nested}
     * @memberof Subscription
     */
    readonly billingAddress: Nested;
    /**
     * 
     * @type {StripeSubscription}
     * @memberof Subscription
     */
    stripeSubscription: StripeSubscription;
}

export function SubscriptionFromJSON(json: any): Subscription {
    return SubscriptionFromJSONTyped(json, false);
}

export function SubscriptionFromJSONTyped(json: any, ignoreDiscriminator: boolean): Subscription {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'paymentMethod': !exists(json, 'payment_method') ? undefined : PaymentMethodEnumFromJSON(json['payment_method']),
        'plan': NestedFromJSON(json['plan']),
        'billingAddress': NestedFromJSON(json['billing_address']),
        'stripeSubscription': StripeSubscriptionFromJSON(json['stripe_subscription']),
    };
}

export function SubscriptionToJSON(value?: Subscription | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'payment_method': PaymentMethodEnumToJSON(value.paymentMethod),
        'stripe_subscription': StripeSubscriptionToJSON(value.stripeSubscription),
    };
}


