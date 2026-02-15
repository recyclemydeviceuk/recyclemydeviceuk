import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CART_STORAGE_KEY = 'recyclemydevice_cart';

export interface CartItem {
  deviceId: string;
  deviceName: string;
  deviceImage: string;
  recyclerId: string;
  recyclerName: string;
  recyclerLogo: string;
  recyclerCity: string;
  price: number;
  storage: string;
  condition: string;
}

interface CartContextType {
  cartItem: CartItem | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Initialize cart from localStorage
  const [cartItem, setCartItem] = useState<CartItem | null>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : null;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return null;
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      if (cartItem) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItem));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItem]);

  const addToCart = (item: CartItem) => {
    setCartItem(item);
  };

  const removeFromCart = () => {
    setCartItem(null);
  };

  const clearCart = () => {
    setCartItem(null);
  };

  return (
    <CartContext.Provider value={{ cartItem, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
