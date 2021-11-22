import { Model } from '@bitforgehq/genie-api-client';
import Vue from 'vue';
import LineItem from './LineItem';

export default class Cart {
    public lineItems: LineItem[] = new Array<LineItem>();
    public totalPrice = 0.0;
    public totalCurrency = 'CHF';

    public updateModels(models: Model[]): void {
        const cartBuilder = new Map<Model, number>();
        for (const model of models) {
            const modelKeys = Array.from(cartBuilder.keys());
            const storeModel = modelKeys.find(m => m.id === model.id);
            if (!storeModel) {
                cartBuilder.set(model, 1);
            } else {
                const quantity = cartBuilder.get(storeModel);
                if (quantity) cartBuilder.set(storeModel, quantity + 1);
            }
        }

        let totalPrice = 0.0;
        const newLineItems = new Array<LineItem>();
        for (const [model, quantity] of cartBuilder) {
            const lineItem = new LineItem(model, quantity);
            totalPrice += lineItem.linePrice;
            newLineItems.push(lineItem);
        }

        // Ensure updates are reactive
        Vue.set(this, 'totalPrice', totalPrice);
        Vue.set(this, 'lineItems', newLineItems);
    }
}
