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
    FilterEventsEnum,
    FilterEventsEnumFromJSON,
    FilterEventsEnumFromJSONTyped,
    FilterEventsEnumToJSON,
    ProjectsStatisticsGroupByEnum,
    ProjectsStatisticsGroupByEnumFromJSON,
    ProjectsStatisticsGroupByEnumFromJSONTyped,
    ProjectsStatisticsGroupByEnumToJSON,
    ReportFormatEnum,
    ReportFormatEnumFromJSON,
    ReportFormatEnumFromJSONTyped,
    ReportFormatEnumToJSON,
    TimeRangeEnum,
    TimeRangeEnumFromJSON,
    TimeRangeEnumFromJSONTyped,
    TimeRangeEnumToJSON,
} from './';

/**
 * 
 * @export
 * @interface ProjectsStatistics
 */
export interface ProjectsStatistics {
    /**
     * 
     * @type {ReportFormatEnum}
     * @memberof ProjectsStatistics
     */
    reportFormat: ReportFormatEnum;
    /**
     * 
     * @type {TimeRangeEnum}
     * @memberof ProjectsStatistics
     */
    timeRange: TimeRangeEnum;
    /**
     * 
     * @type {FilterEventsEnum}
     * @memberof ProjectsStatistics
     */
    filterEvents: FilterEventsEnum;
    /**
     * 
     * @type {ProjectsStatisticsGroupByEnum}
     * @memberof ProjectsStatistics
     */
    groupBy: ProjectsStatisticsGroupByEnum;
}

export function ProjectsStatisticsFromJSON(json: any): ProjectsStatistics {
    return ProjectsStatisticsFromJSONTyped(json, false);
}

export function ProjectsStatisticsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectsStatistics {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'reportFormat': ReportFormatEnumFromJSON(json['report_format']),
        'timeRange': TimeRangeEnumFromJSON(json['time_range']),
        'filterEvents': FilterEventsEnumFromJSON(json['filter_events']),
        'groupBy': ProjectsStatisticsGroupByEnumFromJSON(json['group_by']),
    };
}

export function ProjectsStatisticsToJSON(value?: ProjectsStatistics | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'report_format': ReportFormatEnumToJSON(value.reportFormat),
        'time_range': TimeRangeEnumToJSON(value.timeRange),
        'filter_events': FilterEventsEnumToJSON(value.filterEvents),
        'group_by': ProjectsStatisticsGroupByEnumToJSON(value.groupBy),
    };
}


