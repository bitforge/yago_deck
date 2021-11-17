import { Model } from '@bitforgehq/genie-api-client';

export default class CartItem {
    public model: Model;
    public count: number;

    constructor(model: Model, count: number) {
        this.model = model;
        this.count = count;
    }
}
