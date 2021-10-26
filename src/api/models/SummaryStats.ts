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
 * @interface SummaryStats
 */
export interface SummaryStats {
    /**
     * 
     * @type {Array<any>}
     * @memberof SummaryStats
     */
    labels: Array<any>;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof SummaryStats
     */
    datasets: { [key: string]: any; };
}

export function SummaryStatsFromJSON(json: any): SummaryStats {
    return SummaryStatsFromJSONTyped(json, false);
}

export function SummaryStatsFromJSONTyped(json: any, ignoreDiscriminator: boolean): SummaryStats {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'labels': json['labels'],
        'datasets': json['datasets'],
    };
}

export function SummaryStatsToJSON(value?: SummaryStats | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'labels': value.labels,
        'datasets': value.datasets,
    };
}

