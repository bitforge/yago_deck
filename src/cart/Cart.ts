import { Model } from '@bitforgehq/genie-api-client';
import Vue from 'vue';
import LineItem from './LineItem';

export default class Cart {
    public lineItems: LineItem[] = new Array<LineItem>();

    public updateModels(models: Model[]): void {
        const cartBuilder = new Map<Model, number>();
        for (const model of models) {
            if (!cartBuilder.has(model)) {
                cartBuilder.set(model, 1);
            } else {
                const quantity = cartBuilder.get(model);
                if (quantity) cartBuilder.set(model, quantity + 1);
            }
        }

        const newLineItems = new Array<LineItem>();
        for (const [model, quantity] of cartBuilder) {
            const lineItem = new LineItem(model, quantity);
            newLineItems.push(lineItem);
        }

        // Ensure update are reactive
        Vue.set(this, 'lineItems', newLineItems);
    }
}
