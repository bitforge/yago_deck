import { EventBus } from '@/Messaging';

declare module 'vue/types/vue' {
    interface Vue {
        $bus: EventBus;
    }
}
