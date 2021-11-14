// Global events sent on $root component
export enum Events {
    // Start WebXR session
    LaunchXR = 'launchXR',
    // Change selected model
    SelectModel = 'selectModel',
    // Place selected model on cursor position
    PlaceModel = 'placeModel',
    // Remove last placed model
    UnplaceModel = 'unplaceModel',
    // Remove all models
    ClearPlaced = 'clearPlace',
}
