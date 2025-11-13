import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

function getCartKey(user) {
  return user && user.email ? `cart_${user.email}` : "cart_guest";
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  // Always use the correct initial
  const [cart, setCart] = useState(() => {
    // Try signed-in user's cart first
    const key = getCartKey(user);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // On user/email change, swap cart automatically
  useEffect(() => {
    const key = getCartKey(user);
    const fromStorage = localStorage.getItem(key);
    setCart(fromStorage ? JSON.parse(fromStorage) : []);
  }, [user]);

  // Always save cart to correct slot
  useEffect(() => {
    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(cart));
  }, [cart, user]);

  // Add product (append even as guest)
  function addToCart(product) {
    setCart(prev => [...prev, product]);
  }

  // Remove item by index
  function removeFromCart(index) {
    setCart(prev => prev.filter((_, i) => i !== index));
  }

  // Update quantity, assumes items in cart are objects with quantity field
  function updateQuantity(index, change) {
    setCart(prev =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + change) }
          : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

