import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { Configuration, Model, ModelsApi, ModelStatus } from '@bitforgehq/genie-api-client';
import THREE from 'three';

@Module({ name: 'global' })
export default class GlobalState extends VuexModule {
    /** Toggles visiblity of UI elements in dev mode */
    public devMode = process.env.NODE_ENV === 'development';

    /** True when WebXR is supported */
    public xrSupported = false;

    /** True when WebXR session is active */
    public xrActive = false;

    /** True when showing placed models only */
    public viewOnlyMode = true;

    /** True when cart is visible */
    public showCart = false;

    /** Model details loaded from API */
    public models: Model[] = [];

    /** Currently placed models in scene, in order of placement */
    public placed: Model[] = [];

    /* An object is focused when it's in the center of viewport */
    public focused: THREE.Object3D | null = null;

    @Mutation
    public setXRSupported(xrSupported: boolean): void {
        this.xrSupported = xrSupported;
    }

    @Mutation
    public setXRActive(xrActive: boolean): void {
        this.xrActive = xrActive;
    }

    @Mutation
    public setViewOnlyMode(viewOnlyMode: boolean): void {
        this.viewOnlyMode = viewOnlyMode;
    }

    @Mutation
    public setShowCart(showCart: boolean): void {
        this.showCart = showCart;
    }

    @Mutation
    public setModels(models: Model[]): void {
        this.models = models;
    }

    @Mutation
    public setFocused(model: THREE.Object3D | null): void {
        this.focused = model;
    }

    @Mutation
    public placeModel(model: Model): void {
        // Using number to store objectID from scene
        this.placed.push(model);
    }

    @Mutation
    public unplaceModel(model: Model): void {
        const indexToRemove = this.placed.findIndex(mdl => mdl.number === model.number);
        if (indexToRemove > -1) {
            this.placed.splice(indexToRemove, 1);
        }
    }

    @Mutation
    public clearPlaced(): void {
        this.placed = [];
    }

    @Action({ commit: 'setModels' })
    public async loadModels(): Promise<Model[]> {
        const modelApi = new ModelsApi(new Configuration({ apiKey: process.env.VUE_APP_API_KEY }));
        const models = await modelApi.modelsList({ project: process.env.VUE_APP_PROJECT_ID });
        const activeModels = models.filter((model: Model) => model.status != ModelStatus.Draft);
        this.context.commit('setViewOnlyMode', false);
        return activeModels;
    }

    public get getModelById() {
        return (id: string): Model | undefined => this.models.find(model => model.id === id);
    }
}
