import { Model } from '@bitforgehq/genie-api-client';

export default class LineItem {
    public model: Model;
    public quantity: number;
    public priceTotal = 0.0;
    public priceDisplay = 'XX CHF';

    constructor(model: Model, quantity: number) {
        this.model = model;
        this.quantity = quantity;
        if (model.price && model.priceCurrency) {
            const parsedPrice = Number.parseFloat(model.price);
            this.priceTotal = parsedPrice * quantity;
            this.priceDisplay = `${this.priceTotal} ${model.priceCurrency}`;
        }
    }
}
