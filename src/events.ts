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
    // Remove all models
    ClearPlaced = 'clearPlace',
    // Model visible in center of screen;
    FocusedModel = 'focusModel',
    // Left model in center of screen
    UnfocusedModel = 'unfocusedModel',
}
