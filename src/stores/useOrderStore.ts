import { create } from 'zustand';
import type { OrderActionEvent } from '../types/order';

interface OrderState {
  incomingOrders: OrderActionEvent[];
  viewedOrderIds: Set<string>;
  addOrder: (order: OrderActionEvent) => void;
  removeOrder: (orderId: string) => void;
  markAsViewed: (orderId: string) => void;
  clearAll: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  incomingOrders: [],
  viewedOrderIds: new Set(),

  addOrder: (order) => set((state) => {
    // Avoid duplicates
    if (state.incomingOrders.some(o => o.orderId === order.orderId)) return state;
    return { incomingOrders: [...state.incomingOrders, order] };
  }),

  removeOrder: (orderId) => set((state) => ({
    incomingOrders: state.incomingOrders.filter(o => o.orderId !== orderId),
    // Also clean up viewed status if removed
    viewedOrderIds: new Set([...state.viewedOrderIds].filter(id => id !== orderId))
  })),

  markAsViewed: (orderId) => set((state) => ({
    viewedOrderIds: new Set(state.viewedOrderIds).add(orderId)
  })),

  clearAll: () => set({ incomingOrders: [], viewedOrderIds: new Set() }),
}));

(window as any).store = useOrderStore;
