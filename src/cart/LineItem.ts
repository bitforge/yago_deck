import { Model } from '@bitforgehq/genie-api-client';

export default class LineItem {
    public model: Model;
    public quantity: number;

    constructor(model: Model, quantity: number) {
        this.model = model;
        this.quantity = quantity;
    }
}
