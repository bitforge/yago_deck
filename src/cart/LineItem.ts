import { Model } from '@bitforgehq/yago-api-client';

export default class LineItem {
    public model: Model;
    public quantity: number;
    public itemPrice = 0.0;
    public linePrice = 0.0;
    public priceDisplay = 'XX CHF';

    constructor(model: Model, quantity: number) {
        this.model = model;
        this.quantity = quantity;
        if (model.price && model.priceCurrency) {
            this.itemPrice = Number.parseFloat(model.price);
            this.linePrice = this.itemPrice * quantity;
            this.priceDisplay = `${this.linePrice} ${model.priceCurrency}`;
        }
    }
}
