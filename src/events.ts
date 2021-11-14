// Global events sent on $root component
export enum Events {
    // Start WebXR session
    LaunchXR = 'launchXR',
    // Place selected model on cursor position
    PlaceModel = 'placeModel',
    // Change selected model
    SelectModel = 'selectModel',
    // Remove last placed model
    UndoModel = 'removeLastModel',
    // Remove all models
    ClearModels = 'removeAllModels',
}
