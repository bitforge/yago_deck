/* eslint-disable @typescript-eslint/ban-types */

// Global events sent on $root component

export enum Messages {
    LAUNCH_XR = 'launchXR',
    MODEL_PLACE = 'placeModel',
    MODEL_SELECT = 'selectModel',
    MODEL_UNDO = 'removeLastModel',
    MODEL_CLEAR = 'removeAllModels',
}
