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
import {
    ModelStatus,
    ModelStatusFromJSON,
    ModelStatusFromJSONTyped,
    ModelStatusToJSON,
} from './';

/**
 * 
 * @export
 * @interface PatchedModelUpdate
 */
export interface PatchedModelUpdate {
    /**
     * Name will be visible in Android as title.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    nameDe?: string | null;
    /**
     * Name will be visible in Android as title.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    nameEn?: string | null;
    /**
     * Name will be visible in Android as title.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    nameFr?: string | null;
    /**
     * Name will be visible in Android as title.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    nameIt?: string | null;
    /**
     * DRAFT=In development, READY=Modelling complete, ONLINE=Active use.
     * @type {ModelStatus}
     * @memberof PatchedModelUpdate
     */
    status?: ModelStatus;
    /**
     * 
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    readonly description?: string;
    /**
     * Used when shared as link and for SEO.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    descriptionDe?: string | null;
    /**
     * Used when shared as link and for SEO.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    descriptionEn?: string | null;
    /**
     * Used when shared as link and for SEO.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    descriptionFr?: string | null;
    /**
     * Used when shared as link and for SEO.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    descriptionIt?: string | null;
    /**
     * Use for custom sort order.
     * @type {number}
     * @memberof PatchedModelUpdate
     */
    number?: number | null;
    /**
     * Link to the product on your site. Required when using standalone QR codes (e.g. Print).
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    siteUrlDe?: string | null;
    /**
     * Link to the product on your site. Required when using standalone QR codes (e.g. Print).
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    siteUrlEn?: string | null;
    /**
     * Link to the product on your site. Required when using standalone QR codes (e.g. Print).
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    siteUrlFr?: string | null;
    /**
     * Link to the product on your site. Required when using standalone QR codes (e.g. Print).
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    siteUrlIt?: string | null;
    /**
     * Let's the user scale the model in AR when enabled.
     * @type {boolean}
     * @memberof PatchedModelUpdate
     */
    scaleable?: boolean;
    /**
     * Stock-keeping unit. The identfier of the product in external webstore.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    sku?: string | null;
    /**
     * Display price. The effective price is determined by the external webstore.
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    price?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedModelUpdate
     */
    readonly priceCurrency?: string;
}

export function PatchedModelUpdateFromJSON(json: any): PatchedModelUpdate {
    return PatchedModelUpdateFromJSONTyped(json, false);
}

export function PatchedModelUpdateFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedModelUpdate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'nameDe': !exists(json, 'name_de') ? undefined : json['name_de'],
        'nameEn': !exists(json, 'name_en') ? undefined : json['name_en'],
        'nameFr': !exists(json, 'name_fr') ? undefined : json['name_fr'],
        'nameIt': !exists(json, 'name_it') ? undefined : json['name_it'],
        'status': !exists(json, 'status') ? undefined : ModelStatusFromJSON(json['status']),
        'description': !exists(json, 'description') ? undefined : json['description'],
        'descriptionDe': !exists(json, 'description_de') ? undefined : json['description_de'],
        'descriptionEn': !exists(json, 'description_en') ? undefined : json['description_en'],
        'descriptionFr': !exists(json, 'description_fr') ? undefined : json['description_fr'],
        'descriptionIt': !exists(json, 'description_it') ? undefined : json['description_it'],
        'number': !exists(json, 'number') ? undefined : json['number'],
        'siteUrlDe': !exists(json, 'site_url_de') ? undefined : json['site_url_de'],
        'siteUrlEn': !exists(json, 'site_url_en') ? undefined : json['site_url_en'],
        'siteUrlFr': !exists(json, 'site_url_fr') ? undefined : json['site_url_fr'],
        'siteUrlIt': !exists(json, 'site_url_it') ? undefined : json['site_url_it'],
        'scaleable': !exists(json, 'scaleable') ? undefined : json['scaleable'],
        'sku': !exists(json, 'sku') ? undefined : json['sku'],
        'price': !exists(json, 'price') ? undefined : json['price'],
        'priceCurrency': !exists(json, 'price_currency') ? undefined : json['price_currency'],
    };
}

export function PatchedModelUpdateToJSON(value?: PatchedModelUpdate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name_de': value.nameDe,
        'name_en': value.nameEn,
        'name_fr': value.nameFr,
        'name_it': value.nameIt,
        'status': ModelStatusToJSON(value.status),
        'description_de': value.descriptionDe,
        'description_en': value.descriptionEn,
        'description_fr': value.descriptionFr,
        'description_it': value.descriptionIt,
        'number': value.number,
        'site_url_de': value.siteUrlDe,
        'site_url_en': value.siteUrlEn,
        'site_url_fr': value.siteUrlFr,
        'site_url_it': value.siteUrlIt,
        'scaleable': value.scaleable,
        'sku': value.sku,
        'price': value.price,
    };
}


