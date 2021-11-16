import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import { Model } from '@bitforgehq/genie-api-client';

@Module({ name: 'global' })
export default class GlobalState extends VuexModule {
    /** Toggles visiblity of UI elements in dev */
    public devMode = process.env.NODE_ENV === 'development';

    /** True when WebXR is supported */
    public xrSupported = false;

    /** True when WebXR session is active */
    public xrActive = false;

    /** True when only showing placed models */
    public viewOnlyMode = false;

    /** Models loaded from api */
    public models: Model[] = [];

    /** Currently placed models in scene */
    public placed: Model[] = [];

    @Mutation
    setXRSupported(xrSupported: boolean): void {
        this.xrSupported = xrSupported;
    }

    @Mutation
    setXRActive(xrActive: boolean): void {
        this.xrActive = xrActive;
    }

    @Mutation
    setViewOnlyMode(viewOnlyMode: boolean): void {
        this.viewOnlyMode = viewOnlyMode;
    }

    @Mutation
    setModels(models: Model[]): void {
        this.models = models;
    }

    @Mutation
    placeModel(model: Model): void {
        this.placed.push(model);
    }

    @Mutation
    unplaceModel(): void {
        this.placed.pop();
    }

    @Mutation
    clearPlaced(): void {
        this.placed = [];
    }

    public get getModelById() {
        return (id: string): Model | undefined => this.models.find(model => model.id === id);
    }
}
