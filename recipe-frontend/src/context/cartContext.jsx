import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ Add to cart (with quantity handling)
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === item.name);

      if (existing) {
        return prev.map((p) =>
          p.name === item.name
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  // ✅ Remove one quantity
  const removeFromCart = (name) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // ✅ Delete full item
  const deleteItem = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  // ✅ Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // ✅ Total items
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // ✅ Total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = () => useContext(CartContext);