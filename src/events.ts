// Global events sent on $root component
export enum Events {
    // Start WebXR session
    LaunchXR = 'launchXR',
    // End WebXR session
    EndXR = 'endXR',
    // Change selected model
    SelectModel = 'selectModel',
    // Place selected model on cursor position
    PlaceModel = 'placeModel',
    // Remove last placed model
    UnplaceModel = 'unplaceModel',
    // Remove specific focused model
    RemoveModel = 'deleteModel',
    // Remove all models
    ClearPlaced = 'clearPlaced',
}
