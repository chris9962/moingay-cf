import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  note: string;
}

export interface UserInfo {
  name: string;
  phone1: string;
  phone2: string;
  address: string;
}

interface CartState {
  // Cart items
  items: CartItem[];

  // User info (persisted for auto-fill)
  userInfo: UserInfo;

  // Actions
  addItem: (
    product: Omit<CartItem, "quantity" | "note">,
    quantity: number,
    note: string
  ) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  updateNote: (id: number, note: string) => void;
  clearCart: () => void;

  // User info actions
  updateUserInfo: (info: Partial<UserInfo>) => void;

  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      userInfo: {
        name: "",
        phone1: "",
        phone2: "",
        address: "",
      },

      // Actions
      addItem: (product, quantity, note) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // If item exists, update quantity and note
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity, note }
                : item
            ),
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity, note }],
          });
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      updateNote: (id, note) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, note } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      updateUserInfo: (info) => {
        set({
          userInfo: { ...get().userInfo, ...info },
        });
      },

      // Computed
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        userInfo: state.userInfo,
      }),
    }
  )
);
