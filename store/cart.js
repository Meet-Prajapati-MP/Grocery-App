import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export let useCartStore = create(
    immer((set) => ({
        cart: [],
        totalPrice: 0,

        addToCart: (product) => set((state) => {
            const existingItem = state.cart.find((item) => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cart.push({ ...product, quantity: 1 });
            }
            state.totalPrice += product.price;
        }),

        updateItemQuantity: (id, quantity, price) => set((state) => {
            const item = state.cart.find((item) => item.id === id);
            if (item) {
                const difference = (quantity - item.quantity) * price;
                item.quantity = quantity > 0 ? quantity : 1;
                state.totalPrice += difference;
            }
        }),

        removeItem: (productId) => set((state) => {
            const item = state.cart.find((item) => item.id === productId);
            if (item) {
                state.totalPrice -= item.price * item.quantity;
                state.cart = state.cart.filter((item) => item.id !== productId);
            }
        }),

        clearCart: () => set((state) => {
            state.cart = [];
            state.totalPrice = 0;
        }),
    }))
);